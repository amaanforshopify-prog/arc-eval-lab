import { describe, it, expect } from 'vitest';
import { JsonSchemaEvaluator } from '../../src/evaluators/json-schema.js';
import type { EvaluationInput } from '../../src/evaluators/base.js';

describe('JsonSchemaEvaluator', () => {
  describe('evaluate', () => {
    it('should pass when output matches schema', () => {
      const evaluator = new JsonSchemaEvaluator();
      const input: EvaluationInput = {
        output: { name: 'test', value: 123 },
        expected: { name: 'string', value: 'number' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should fail when output is not an object', () => {
      const evaluator = new JsonSchemaEvaluator();
      const input: EvaluationInput = {
        output: 'not an object',
        expected: { name: 'string' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
      expect(result.details.reason).toBeDefined();
    });

    it('should fail when expected is not an object', () => {
      const evaluator = new JsonSchemaEvaluator();
      const input: EvaluationInput = {
        output: { name: 'test' },
        expected: 'not an object',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
      expect(result.details.reason).toBeDefined();
    });

    it('should fail when output is null', () => {
      const evaluator = new JsonSchemaEvaluator();
      const input: EvaluationInput = {
        output: null,
        expected: { name: 'string' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
    });

    it('should fail when output is an array', () => {
      const evaluator = new JsonSchemaEvaluator();
      const input: EvaluationInput = {
        output: [1, 2, 3],
        expected: { name: 'string' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
    });

    it('should require all fields by default', () => {
      const evaluator = new JsonSchemaEvaluator();
      const input: EvaluationInput = {
        output: { name: 'test' },
        expected: { name: 'string', value: 'number' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
      expect(result.details.errors).toContain('Missing required field: value');
    });

    it('should not require all fields when disabled', () => {
      const evaluator = new JsonSchemaEvaluator({ requireAllFields: false });
      const input: EvaluationInput = {
        output: { name: 'test' },
        expected: { name: 'string', value: 'number' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should allow extra fields by default', () => {
      const evaluator = new JsonSchemaEvaluator();
      const input: EvaluationInput = {
        output: { name: 'test', extra: 'field' },
        expected: { name: 'string' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should reject extra fields when disabled', () => {
      const evaluator = new JsonSchemaEvaluator({ allowExtraFields: false });
      const input: EvaluationInput = {
        output: { name: 'test', extra: 'field' },
        expected: { name: 'string' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
      expect(result.details.errors).toContain('Unexpected field: extra');
    });

    it('should be non-strict by default', () => {
      const evaluator = new JsonSchemaEvaluator();
      const input: EvaluationInput = {
        output: { value: '123' },
        expected: { value: 'number' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should be strict when enabled', () => {
      const evaluator = new JsonSchemaEvaluator({ strict: true });
      const input: EvaluationInput = {
        output: { value: '123' },
        expected: { value: 'number' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
      expect(result.details.errors).toContain('Field \'value\' type mismatch: expected number, got string');
    });

    it('should handle string type in schema', () => {
      const evaluator = new JsonSchemaEvaluator();
      const input: EvaluationInput = {
        output: { name: 'test' },
        expected: { name: 'string' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should handle number type in schema', () => {
      const evaluator = new JsonSchemaEvaluator();
      const input: EvaluationInput = {
        output: { value: 123 },
        expected: { value: 'number' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should handle boolean type in schema', () => {
      const evaluator = new JsonSchemaEvaluator();
      const input: EvaluationInput = {
        output: { active: true },
        expected: { active: 'boolean' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should handle null type in schema', () => {
      const evaluator = new JsonSchemaEvaluator();
      const input: EvaluationInput = {
        output: { value: null },
        expected: { value: null },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should handle object type in schema', () => {
      const evaluator = new JsonSchemaEvaluator();
      const input: EvaluationInput = {
        output: { nested: { key: 'value' } },
        expected: { nested: 'object' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should handle array type in schema', () => {
      const evaluator = new JsonSchemaEvaluator();
      const input: EvaluationInput = {
        output: { items: [1, 2, 3] },
        expected: { items: 'array' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should include schema in details', () => {
      const evaluator = new JsonSchemaEvaluator();
      const input: EvaluationInput = {
        output: { name: 'test' },
        expected: { name: 'string' },
      };

      const result = evaluator.evaluate(input);

      expect(result.details.schema).toBeDefined();
    });

    it('should include errors in details when validation fails', () => {
      const evaluator = new JsonSchemaEvaluator({ requireAllFields: true });
      const input: EvaluationInput = {
        output: { name: 'test' },
        expected: { name: 'string', value: 'number' },
      };

      const result = evaluator.evaluate(input);

      expect(result.details.errors).toBeDefined();
      expect(result.details.errors.length).toBeGreaterThan(0);
    });

    it('should include warnings in details for non-strict mode', () => {
      const evaluator = new JsonSchemaEvaluator({ strict: false });
      const input: EvaluationInput = {
        output: { value: '123' },
        expected: { value: 'number' },
      };

      const result = evaluator.evaluate(input);

      expect(result.details.warnings).toBeDefined();
    });

    it('should apply all options together', () => {
      const evaluator = new JsonSchemaEvaluator({
        strict: true,
        allowExtraFields: false,
        requireAllFields: true,
      });

      const input: EvaluationInput = {
        output: { name: 'test', value: 123 },
        expected: { name: 'string', value: 'number' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should handle empty schema', () => {
      const evaluator = new JsonSchemaEvaluator();
      const input: EvaluationInput = {
        output: { name: 'test' },
        expected: {},
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should handle empty object with requireAllFields', () => {
      const evaluator = new JsonSchemaEvaluator({ requireAllFields: true });
      const input: EvaluationInput = {
        output: {},
        expected: { name: 'string' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
    });
  });
});
