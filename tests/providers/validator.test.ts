import { describe, it, expect } from 'vitest';
import { ProviderValidator } from '../../src/providers/validator.js';
import type { ProviderConfig, ProviderResponse } from '../../src/domain/provider.js';

describe('ProviderValidator', () => {
  const validator = new ProviderValidator();

  describe('validateConfig', () => {
    it('should accept valid config', () => {
      const config: ProviderConfig = {
        timeout: 5000,
        maxRetries: 3,
      };

      const errors = validator.validateConfig(config);

      expect(errors).toHaveLength(0);
    });

    it('should accept empty config', () => {
      const errors = validator.validateConfig({});

      expect(errors).toHaveLength(0);
    });

    it('should reject invalid timeout type', () => {
      const config: ProviderConfig = {
        timeout: '5000' as unknown as number,
      };

      const errors = validator.validateConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].path).toBe('timeout');
      expect(errors[0].code).toBe('INVALID_TYPE');
    });

    it('should reject timeout <= 0', () => {
      const config: ProviderConfig = { timeout: 0 };

      const errors = validator.validateConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].path).toBe('timeout');
      expect(errors[0].code).toBe('INVALID_VALUE');
    });

    it('should reject negative timeout', () => {
      const config: ProviderConfig = { timeout: -100 };

      const errors = validator.validateConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('INVALID_VALUE');
    });

    it('should reject timeout > 300000', () => {
      const config: ProviderConfig = { timeout: 300001 };

      const errors = validator.validateConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('INVALID_VALUE');
    });

    it('should reject invalid maxRetries type', () => {
      const config: ProviderConfig = {
        maxRetries: '3' as unknown as number,
      };

      const errors = validator.validateConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].path).toBe('maxRetries');
      expect(errors[0].code).toBe('INVALID_TYPE');
    });

    it('should reject negative maxRetries', () => {
      const config: ProviderConfig = { maxRetries: -1 };

      const errors = validator.validateConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('INVALID_VALUE');
    });

    it('should reject maxRetries > 10', () => {
      const config: ProviderConfig = { maxRetries: 11 };

      const errors = validator.validateConfig(config);

      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('INVALID_VALUE');
    });

    it('should accept maxRetries = 0', () => {
      const config: ProviderConfig = { maxRetries: 0 };

      const errors = validator.validateConfig(config);

      expect(errors).toHaveLength(0);
    });

    it('should accept maxRetries = 10', () => {
      const config: ProviderConfig = { maxRetries: 10 };

      const errors = validator.validateConfig(config);

      expect(errors).toHaveLength(0);
    });

    it('should return multiple errors for invalid config', () => {
      const config: ProviderConfig = {
        timeout: -100,
        maxRetries: 15,
      };

      const errors = validator.validateConfig(config);

      expect(errors).toHaveLength(2);
    });
  });

  describe('validateResponse', () => {
    it('should accept valid response', () => {
      const response: ProviderResponse = {
        output: 'test output',
        latency: 100,
      };

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(0);
    });

    it('should reject missing output', () => {
      const response: ProviderResponse = {} as ProviderResponse;

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(1);
      expect(errors[0].path).toBe('output');
      expect(errors[0].code).toBe('MISSING_FIELD');
    });

    it('should accept output = 0', () => {
      const response: ProviderResponse = {
        output: 0,
      };

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(0);
    });

    it('should accept output = false', () => {
      const response: ProviderResponse = {
        output: false,
      };

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(0);
    });

    it('should reject invalid latency type', () => {
      const response: ProviderResponse = {
        output: 'test',
        latency: '100' as unknown as number,
      };

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(1);
      expect(errors[0].path).toBe('latency');
      expect(errors[0].code).toBe('INVALID_TYPE');
    });

    it('should reject negative latency', () => {
      const response: ProviderResponse = {
        output: 'test',
        latency: -10,
      };

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('INVALID_VALUE');
    });

    it('should accept latency = 0', () => {
      const response: ProviderResponse = {
        output: 'test',
        latency: 0,
      };

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(0);
    });

    it('should accept valid token usage', () => {
      const response: ProviderResponse = {
        output: 'test',
        tokenUsage: {
          promptTokens: 10,
          completionTokens: 20,
          totalTokens: 30,
        },
      };

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(0);
    });

    it('should reject invalid token usage type', () => {
      const response: ProviderResponse = {
        output: 'test',
        tokenUsage: 'invalid' as unknown as Record<string, number>,
      };

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(1);
      expect(errors[0].path).toBe('tokenUsage.');
      expect(errors[0].code).toBe('INVALID_TYPE');
    });

    it('should reject null token usage', () => {
      const response: ProviderResponse = {
        output: 'test',
        tokenUsage: null as unknown as Record<string, number>,
      };

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('INVALID_TYPE');
    });

    it('should reject invalid promptTokens type', () => {
      const response: ProviderResponse = {
        output: 'test',
        tokenUsage: {
          promptTokens: '10' as unknown as number,
        },
      };

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(1);
      expect(errors[0].path).toBe('tokenUsage.promptTokens');
      expect(errors[0].code).toBe('INVALID_TYPE');
    });

    it('should reject negative promptTokens', () => {
      const response: ProviderResponse = {
        output: 'test',
        tokenUsage: {
          promptTokens: -10,
        },
      };

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('INVALID_VALUE');
    });

    it('should reject invalid completionTokens type', () => {
      const response: ProviderResponse = {
        output: 'test',
        tokenUsage: {
          completionTokens: '20' as unknown as number,
        },
      };

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(1);
      expect(errors[0].path).toBe('tokenUsage.completionTokens');
    });

    it('should reject negative completionTokens', () => {
      const response: ProviderResponse = {
        output: 'test',
        tokenUsage: {
          completionTokens: -20,
        },
      };

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('INVALID_VALUE');
    });

    it('should reject invalid totalTokens type', () => {
      const response: ProviderResponse = {
        output: 'test',
        tokenUsage: {
          totalTokens: '30' as unknown as number,
        },
      };

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(1);
      expect(errors[0].path).toBe('tokenUsage.totalTokens');
    });

    it('should reject negative totalTokens', () => {
      const response: ProviderResponse = {
        output: 'test',
        tokenUsage: {
          totalTokens: -30,
        },
      };

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(1);
      expect(errors[0].code).toBe('INVALID_VALUE');
    });

    it('should accept token usage with zero values', () => {
      const response: ProviderResponse = {
        output: 'test',
        tokenUsage: {
          promptTokens: 0,
          completionTokens: 0,
          totalTokens: 0,
        },
      };

      const errors = validator.validateResponse(response);

      expect(errors).toHaveLength(0);
    });

    it('should return multiple errors for invalid response', () => {
      const response: ProviderResponse = {
        output: 'test',
        latency: -10,
        tokenUsage: {
          promptTokens: -5,
          totalTokens: 'invalid' as unknown as number,
        },
      };

      const errors = validator.validateResponse(response);

      expect(errors.length).toBeGreaterThan(0);
    });
  });
});
