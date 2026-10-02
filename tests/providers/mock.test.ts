import { describe, it, expect } from 'vitest';
import { MockProvider } from '../../src/providers/mock.js';
import type { ProviderRequest } from '../../src/domain/provider.js';

describe('MockProvider', () => {
  describe('execute', () => {
    it('should return default response for unknown input', async () => {
      const provider = new MockProvider();
      const request: ProviderRequest = { input: 'unknown' };
      const response = await provider.execute(request);

      expect(response.output).toBe('Mock response');
      expect(response.metadata?.provider).toBe('mock');
    });

    it('should return configured response for known input', async () => {
      const provider = new MockProvider();
      provider.setResponse('test-input', { output: 'Custom response' });

      const request: ProviderRequest = { input: 'test-input' };
      const response = await provider.execute(request);

      expect(response.output).toBe('Custom response');
    });

    it('should handle object inputs', async () => {
      const provider = new MockProvider();
      const input = { text: 'hello' };
      provider.setResponse(input, { output: 'Response to object' });

      const request: ProviderRequest = { input };
      const response = await provider.execute(request);

      expect(response.output).toBe('Response to object');
    });

    it('should throw error when configured', async () => {
      const provider = new MockProvider();
      provider.setResponse('error-input', { output: 'ignored', error: 'Simulated error' });

      const request: ProviderRequest = { input: 'error-input' };

      await expect(provider.execute(request)).rejects.toThrow('Simulated error');
    });

    it('should respect configured latency', async () => {
      const provider = new MockProvider();
      provider.setResponse('slow-input', { output: 'Slow response', latency: 100 });

      const request: ProviderRequest = { input: 'slow-input' };
      const startTime = Date.now();
      await provider.execute(request);
      const elapsed = Date.now() - startTime;

      expect(elapsed).toBeGreaterThanOrEqual(100);
      expect(elapsed).toBeLessThan(200);
    });

    it('should include latency in response', async () => {
      const provider = new MockProvider();
      provider.setResponse('test', { output: 'Response', latency: 50 });

      const request: ProviderRequest = { input: 'test' };
      const response = await provider.execute(request);

      expect(response.latency).toBeGreaterThanOrEqual(50);
    });

    it('should include input key in metadata', async () => {
      const provider = new MockProvider();
      const request: ProviderRequest = { input: 'test' };
      const response = await provider.execute(request);

      expect(response.metadata?.inputKey).toBe(JSON.stringify('test'));
    });
  });

  describe('setResponse', () => {
    it('should set response for specific input', async () => {
      const provider = new MockProvider();
      provider.setResponse('input-1', { output: 'Response 1' });
      provider.setResponse('input-2', { output: 'Response 2' });

      const response1 = await provider.execute({ input: 'input-1' });
      const response2 = await provider.execute({ input: 'input-2' });

      expect(response1.output).toBe('Response 1');
      expect(response2.output).toBe('Response 2');
    });

    it('should override existing response', async () => {
      const provider = new MockProvider();
      provider.setResponse('input', { output: 'Original' });
      provider.setResponse('input', { output: 'Updated' });

      const response = await provider.execute({ input: 'input' });

      expect(response.output).toBe('Updated');
    });
  });

  describe('setDefaultResponse', () => {
    it('should set default response for unknown inputs', async () => {
      const provider = new MockProvider();
      provider.setDefaultResponse({ output: 'New default' });

      const response = await provider.execute({ input: 'unknown' });

      expect(response.output).toBe('New default');
    });

    it('should not override specific responses', async () => {
      const provider = new MockProvider();
      provider.setResponse('specific', { output: 'Specific response' });
      provider.setDefaultResponse({ output: 'Default response' });

      const specificResponse = await provider.execute({ input: 'specific' });
      const defaultResponse = await provider.execute({ input: 'unknown' });

      expect(specificResponse.output).toBe('Specific response');
      expect(defaultResponse.output).toBe('Default response');
    });
  });

  describe('clearResponses', () => {
    it('should clear all configured responses', async () => {
      const provider = new MockProvider();
      provider.setResponse('input-1', { output: 'Response 1' });
      provider.setResponse('input-2', { output: 'Response 2' });
      provider.clearResponses();

      const response1 = await provider.execute({ input: 'input-1' });
      const response2 = await provider.execute({ input: 'input-2' });

      expect(response1.output).toBe('Mock response');
      expect(response2.output).toBe('Mock response');
    });
  });
});
