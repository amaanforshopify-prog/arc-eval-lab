import { describe, it, expect } from 'vitest';
import { DeterministicProvider } from '../../src/providers/deterministic.js';
import type { ProviderRequest } from '../../src/domain/provider.js';

describe('DeterministicProvider', () => {
  describe('execute', () => {
    it('should return deterministic response for same input', async () => {
      const provider = new DeterministicProvider({ seed: 'test-seed' });
      const request: ProviderRequest = { input: 'test-input' };

      const response1 = await provider.execute(request);
      const response2 = await provider.execute(request);

      expect(response1.output).toBe(response2.output);
      expect(response1.metadata?.hash).toBe(response2.metadata?.hash);
    });

    it('should return different responses for different inputs', async () => {
      const provider = new DeterministicProvider({ seed: 'test-seed' });

      const response1 = await provider.execute({ input: 'input-1' });
      const response2 = await provider.execute({ input: 'input-2' });

      expect(response1.output).not.toBe(response2.output);
      expect(response1.metadata?.hash).not.toBe(response2.metadata?.hash);
    });

    it('should use custom seed for different hashes', async () => {
      const provider1 = new DeterministicProvider({ seed: 'seed-1' });
      const provider2 = new DeterministicProvider({ seed: 'seed-2' });

      const response1 = await provider1.execute({ input: 'test' });
      const response2 = await provider2.execute({ input: 'test' });

      expect(response1.metadata?.hash).not.toBe(response2.metadata?.hash);
    });

    it('should use custom response template', async () => {
      const provider = new DeterministicProvider({
        seed: 'test-seed',
        responseTemplate: (input, hash) => ({ result: hash, input }),
      });

      const request: ProviderRequest = { input: 'test' };
      const response = await provider.execute(request);

      expect(response.output).toEqual({
        result: response.metadata?.hash,
        input: 'test',
      });
    });

    it('should respect configured latency', async () => {
      const provider = new DeterministicProvider({ seed: 'test-seed', latency: 100 });

      const startTime = Date.now();
      await provider.execute({ input: 'test' });
      const elapsed = Date.now() - startTime;

      expect(elapsed).toBeGreaterThanOrEqual(100);
    });

    it('should include hash in metadata', async () => {
      const provider = new DeterministicProvider({ seed: 'test-seed' });
      const response = await provider.execute({ input: 'test' });

      expect(response.metadata?.hash).toBeDefined();
      expect(typeof response.metadata?.hash).toBe('string');
    });

    it('should include seed in metadata', async () => {
      const provider = new DeterministicProvider({ seed: 'my-seed' });
      const response = await provider.execute({ input: 'test' });

      expect(response.metadata?.seed).toBe('my-seed');
    });

    it('should handle object inputs', async () => {
      const provider = new DeterministicProvider({ seed: 'test-seed' });
      const input = { text: 'hello', count: 42 };

      const response1 = await provider.execute({ input });
      const response2 = await provider.execute({ input });

      expect(response1.output).toBe(response2.output);
    });

    it('should handle array inputs', async () => {
      const provider = new DeterministicProvider({ seed: 'test-seed' });
      const input = ['item1', 'item2'];

      const response1 = await provider.execute({ input });
      const response2 = await provider.execute({ input });

      expect(response1.output).toBe(response2.output);
    });

    it('should include latency in response', async () => {
      const provider = new DeterministicProvider({ seed: 'test-seed', latency: 50 });

      const response = await provider.execute({ input: 'test' });

      expect(response.latency).toBeGreaterThanOrEqual(50);
    });
  });

  describe('hashInput', () => {
    it('should produce consistent hash for same input', () => {
      const provider = new DeterministicProvider({ seed: 'test-seed' });
      const hash1 = provider['hashInput']('test');
      const hash2 = provider['hashInput']('test');

      expect(hash1).toBe(hash2);
    });

    it('should produce different hash for different input', () => {
      const provider = new DeterministicProvider({ seed: 'test-seed' });
      const hash1 = provider['hashInput']('input1');
      const hash2 = provider['hashInput']('input2');

      expect(hash1).not.toBe(hash2);
    });
  });
});
