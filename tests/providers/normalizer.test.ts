import { describe, it, expect } from 'vitest';
import { ProviderResponseNormalizer } from '../../src/providers/normalizer.js';
import type { ProviderResponse } from '../../src/domain/provider.js';

describe('ProviderResponseNormalizer', () => {
  const normalizer = new ProviderResponseNormalizer();

  describe('normalize', () => {
    it('should normalize string output with default options', () => {
      const response: ProviderResponse = {
        output: '  test  response  ',
      };

      const normalized = normalizer.normalize(response);

      expect(normalized.output).toBe('test response');
    });

    it('should not trim strings when disabled', () => {
      const response: ProviderResponse = {
        output: '  test  ',
      };

      const normalized = normalizer.normalize(response, { trimStrings: false, normalizeWhitespace: false });

      expect(normalized.output).toBe('  test  ');
    });

    it('should normalize whitespace in strings', () => {
      const response: ProviderResponse = {
        output: 'test   response   here',
      };

      const normalized = normalizer.normalize(response);

      expect(normalized.output).toBe('test response here');
    });

    it('should not normalize whitespace when disabled', () => {
      const response: ProviderResponse = {
        output: 'test   response',
      };

      const normalized = normalizer.normalize(response, { normalizeWhitespace: false });

      expect(normalized.output).toBe('test   response');
    });

    it('should normalize object output', () => {
      const response: ProviderResponse = {
        output: { '  Key  ': '  value  ' },
      };

      const normalized = normalizer.normalize(response);

      expect(normalized.output).toEqual({ '  Key  ': 'value' });
    });

    it('should lowercase keys when enabled', () => {
      const response: ProviderResponse = {
        output: { Key: 'value' },
      };

      const normalized = normalizer.normalize(response, { lowercaseKeys: true });

      expect(normalized.output).toEqual({ key: 'value' });
    });

    it('should remove null values when enabled', () => {
      const response: ProviderResponse = {
        output: { key: 'value', nullKey: null },
      };

      const normalized = normalizer.normalize(response, { removeNulls: true });

      expect(normalized.output).toEqual({ key: 'value' });
    });

    it('should normalize nested objects', () => {
      const response: ProviderResponse = {
        output: { nested: { '  key  ': '  value  ' } },
      };

      const normalized = normalizer.normalize(response);

      expect(normalized.output).toEqual({ nested: { '  key  ': 'value' } });
    });

    it('should normalize arrays', () => {
      const response: ProviderResponse = {
        output: ['  item1  ', '  item2  '],
      };

      const normalized = normalizer.normalize(response);

      expect(normalized.output).toEqual(['item1', 'item2']);
    });

    it('should preserve latency', () => {
      const response: ProviderResponse = {
        output: 'test',
        latency: 100,
      };

      const normalized = normalizer.normalize(response);

      expect(normalized.latency).toBe(100);
    });

    it('should preserve token usage', () => {
      const response: ProviderResponse = {
        output: 'test',
        tokenUsage: { promptTokens: 10, completionTokens: 20, totalTokens: 30 },
      };

      const normalized = normalizer.normalize(response);

      expect(normalized.tokenUsage).toEqual({
        promptTokens: 10,
        completionTokens: 20,
        totalTokens: 30,
      });
    });

    it('should preserve metadata', () => {
      const response: ProviderResponse = {
        output: 'test',
        metadata: { provider: 'mock' },
      };

      const normalized = normalizer.normalize(response);

      expect(normalized.metadata).toEqual({ provider: 'mock' });
    });

    it('should handle non-string non-object output', () => {
      const response: ProviderResponse = {
        output: 123,
      };

      const normalized = normalizer.normalize(response);

      expect(normalized.output).toBe(123);
    });

    it('should handle null output', () => {
      const response: ProviderResponse = {
        output: null,
      };

      const normalized = normalizer.normalize(response);

      expect(normalized.output).toBeNull();
    });

    it('should apply all normalization options', () => {
      const response: ProviderResponse = {
        output: {
          '  Key1  ': '  value1  ',
          Key2: null,
          Key3: 'value3',
        },
      };

      const normalized = normalizer.normalize(response, {
        trimStrings: true,
        normalizeWhitespace: true,
        lowercaseKeys: true,
        removeNulls: true,
      });

      expect(normalized.output).toEqual({
        key1: 'value1',
        key3: 'value3',
      });
    });
  });
});
