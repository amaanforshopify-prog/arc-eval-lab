import { describe, it, expect } from 'vitest';
import type {
  ProviderConfig,
  ProviderResponse,
  ProviderError,
  ModelProvider,
  ProviderRequest,
} from '../../src/domain/provider.js';

describe('Provider Domain Model', () => {
  describe('ProviderConfig', () => {
    it('should accept minimal config', () => {
      const config: ProviderConfig = {};

      expect(config).toBeDefined();
    });

    it('should accept full config', () => {
      const config: ProviderConfig = {
        apiKey: 'test-key',
        baseUrl: 'https://api.test.com',
        timeout: 30000,
        maxRetries: 3,
        metadata: { region: 'us-east-1' },
      };

      expect(config.apiKey).toBe('test-key');
      expect(config.baseUrl).toBe('https://api.test.com');
      expect(config.timeout).toBe(30000);
      expect(config.maxRetries).toBe(3);
      expect(config.metadata).toEqual({ region: 'us-east-1' });
    });
  });

  describe('ProviderResponse', () => {
    it('should accept minimal response', () => {
      const response: ProviderResponse = {
        output: 'test output',
      };

      expect(response.output).toBe('test output');
    });

    it('should accept response with latency', () => {
      const response: ProviderResponse = {
        output: 'test output',
        latency: 150,
      };

      expect(response.latency).toBe(150);
    });

    it('should accept response with token usage', () => {
      const response: ProviderResponse = {
        output: 'test output',
        tokenUsage: {
          promptTokens: 10,
          completionTokens: 20,
          totalTokens: 30,
        },
      };

      expect(response.tokenUsage?.promptTokens).toBe(10);
      expect(response.tokenUsage?.completionTokens).toBe(20);
      expect(response.tokenUsage?.totalTokens).toBe(30);
    });

    it('should accept response with metadata', () => {
      const response: ProviderResponse = {
        output: 'test output',
        metadata: { model: 'gpt-4' },
      };

      expect(response.metadata).toEqual({ model: 'gpt-4' });
    });
  });

  describe('ProviderError', () => {
    it('should accept minimal error', () => {
      const error: ProviderError = {
        message: 'Test error',
      };

      expect(error.message).toBe('Test error');
    });

    it('should accept full error', () => {
      const error: ProviderError = {
        message: 'Test error',
        code: 'RATE_LIMIT',
        statusCode: 429,
        retryable: true,
      };

      expect(error.code).toBe('RATE_LIMIT');
      expect(error.statusCode).toBe(429);
      expect(error.retryable).toBe(true);
    });
  });

  describe('ModelProvider', () => {
    it('should create model provider', () => {
      const provider: ModelProvider = {
        id: 'provider-1',
        name: 'OpenAI',
        type: 'openai',
        model: 'gpt-4',
        config: {},
      };

      expect(provider.id).toBe('provider-1');
      expect(provider.name).toBe('OpenAI');
      expect(provider.type).toBe('openai');
      expect(provider.model).toBe('gpt-4');
    });

    it('should accept all provider types', () => {
      const types: ModelProvider['type'][] = ['openai', 'anthropic', 'mock', 'custom'];

      types.forEach((type) => {
        const provider: ModelProvider = {
          id: `provider-${type}`,
          name: type.charAt(0).toUpperCase() + type.slice(1),
          type,
          model: 'test-model',
          config: {},
        };
        expect(provider.type).toBe(type);
      });
    });

    it('should create provider with config', () => {
      const provider: ModelProvider = {
        id: 'provider-1',
        name: 'OpenAI',
        type: 'openai',
        model: 'gpt-4',
        config: {
          apiKey: 'test-key',
          timeout: 30000,
        },
      };

      expect(provider.config.apiKey).toBe('test-key');
      expect(provider.config.timeout).toBe(30000);
    });
  });

  describe('ProviderRequest', () => {
    it('should accept minimal request', () => {
      const request: ProviderRequest = {
        input: 'test input',
      };

      expect(request.input).toBe('test input');
    });

    it('should accept request with parameters', () => {
      const request: ProviderRequest = {
        input: 'test input',
        parameters: { temperature: 0.7, maxTokens: 100 },
      };

      expect(request.parameters).toEqual({ temperature: 0.7, maxTokens: 100 });
    });

    it('should accept request with metadata', () => {
      const request: ProviderRequest = {
        input: 'test input',
        metadata: { requestId: 'req-1' },
      };

      expect(request.metadata).toEqual({ requestId: 'req-1' });
    });
  });
});
