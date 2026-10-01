import { describe, it, expect, vi } from 'vitest';
import { BaseProvider } from '../../src/providers/provider.js';
import type { ProviderRequest, ProviderResponse } from '../../src/domain/provider.js';

class TestProvider extends BaseProvider {
  async execute(request: ProviderRequest): Promise<ProviderResponse> {
    return {
      output: `Response to: ${JSON.stringify(request.input)}`,
    };
  }

  // Expose protected methods for testing
  public testWithTimeout<T>(promise: Promise<T>, timeoutMs?: number): Promise<T> {
    return this.withTimeout(promise, timeoutMs);
  }

  public testWithRetry<T>(fn: () => Promise<T>, maxRetries?: number): Promise<T> {
    return this.withRetry(fn, maxRetries);
  }

  public testCreateError(message: string, code?: string, statusCode?: number) {
    return this.createError(message, code, statusCode);
  }
}

describe('BaseProvider', () => {
  describe('constructor', () => {
    it('should initialize with default config', () => {
      const provider = new TestProvider();
      expect(provider['config']).toEqual({});
    });

    it('should initialize with custom config', () => {
      const config = { timeout: 5000, maxRetries: 2 };
      const provider = new TestProvider(config);
      expect(provider['config']).toEqual(config);
    });
  });

  describe('withTimeout', () => {
    it('should resolve promise within timeout', async () => {
      const provider = new TestProvider();
      const promise = Promise.resolve('result');
      const result = await provider.testWithTimeout(promise, 1000);
      expect(result).toBe('result');
    });

    it('should reject on timeout', async () => {
      const provider = new TestProvider();
      const promise = new Promise((resolve) => setTimeout(resolve, 10000));
      await expect(provider.testWithTimeout(promise, 10)).rejects.toThrow('Request timeout');
    });

    it('should use config timeout when not specified', async () => {
      const provider = new TestProvider({ timeout: 50 });
      const promise = new Promise((resolve) => setTimeout(resolve, 10000));
      await expect(provider.testWithTimeout(promise)).rejects.toThrow('Request timeout');
    });
  });

  describe('withRetry', () => {
    it('should succeed on first attempt', async () => {
      const provider = new TestProvider();
      const fn = vi.fn().mockResolvedValue('success');
      const result = await provider.testWithRetry(fn, 3);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('should retry on failure', async () => {
      const provider = new TestProvider();
      const fn = vi.fn()
        .mockRejectedValueOnce(new Error('fail'))
        .mockResolvedValue('success');
      const result = await provider.testWithRetry(fn, 3);
      expect(result).toBe('success');
      expect(fn).toHaveBeenCalledTimes(2);
    });

    it('should exhaust retries and throw', async () => {
      const provider = new TestProvider();
      const fn = vi.fn().mockRejectedValue(new Error('fail'));
      await expect(provider.testWithRetry(fn, 2)).rejects.toThrow('fail');
      expect(fn).toHaveBeenCalledTimes(3); // initial + 2 retries
    });

    it('should use config maxRetries when not specified', async () => {
      const provider = new TestProvider({ maxRetries: 1 });
      const fn = vi.fn().mockRejectedValue(new Error('fail'));
      await expect(provider.testWithRetry(fn)).rejects.toThrow('fail');
      expect(fn).toHaveBeenCalledTimes(2); // initial + 1 retry
    });
  });

  describe('createError', () => {
    it('should create error with message', () => {
      const provider = new TestProvider();
      const error = provider.testCreateError('Test error');
      expect(error.message).toBe('Test error');
      expect(error.code).toBeUndefined();
      expect(error.statusCode).toBeUndefined();
      expect(error.retryable).toBe(false);
    });

    it('should create error with code and status', () => {
      const provider = new TestProvider();
      const error = provider.testCreateError('Test error', 'RATE_LIMIT', 429);
      expect(error.message).toBe('Test error');
      expect(error.code).toBe('RATE_LIMIT');
      expect(error.statusCode).toBe(429);
      expect(error.retryable).toBe(true);
    });

    it('should mark 5xx errors as retryable', () => {
      const provider = new TestProvider();
      const error = provider.testCreateError('Server error', 'SERVER_ERROR', 500);
      expect(error.retryable).toBe(true);
    });

    it('should mark 429 as retryable', () => {
      const provider = new TestProvider();
      const error = provider.testCreateError('Rate limit', 'RATE_LIMIT', 429);
      expect(error.retryable).toBe(true);
    });

    it('should mark 4xx (except 429) as non-retryable', () => {
      const provider = new TestProvider();
      const error = provider.testCreateError('Bad request', 'BAD_REQUEST', 400);
      expect(error.retryable).toBe(false);
    });

    it('should mark rate_limit code as retryable', () => {
      const provider = new TestProvider();
      const error = provider.testCreateError('Rate limit', 'rate_limit');
      expect(error.retryable).toBe(true);
    });

    it('should mark timeout code as retryable', () => {
      const provider = new TestProvider();
      const error = provider.testCreateError('Timeout', 'timeout');
      expect(error.retryable).toBe(true);
    });
  });

  describe('execute', () => {
    it('should be implemented by subclass', async () => {
      const provider = new TestProvider();
      const request: ProviderRequest = { input: 'test' };
      const response = await provider.execute(request);
      expect(response.output).toContain('test');
    });
  });
});
