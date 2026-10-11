import { describe, it, expect } from 'vitest';
import { CustomEvaluator } from '../../src/evaluators/custom.js';
import type { EvaluationInput } from '../../src/evaluators/base.js';

describe('CustomEvaluator', () => {
  describe('evaluate', () => {
    it('should pass when custom function returns true', () => {
      const evaluator = new CustomEvaluator(() => true);
      const input: EvaluationInput = {
        output: 'test',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should fail when custom function returns false', () => {
      const evaluator = new CustomEvaluator(() => false);
      const input: EvaluationInput = {
        output: 'test',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
    });

    it('should handle custom function returning EvaluationResult', () => {
      const evaluator = new CustomEvaluator((input) => ({
        passed: input.output === input.expected,
        details: { custom: 'result' },
      }));

      const input: EvaluationInput = {
        output: 'test',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
      expect(result.details.custom).toBe('result');
    });

    it('should pass input to custom function', () => {
      let receivedInput: EvaluationInput | undefined;

      const evaluator = new CustomEvaluator((input) => {
        receivedInput = input;
        return true;
      });

      const input: EvaluationInput = {
        output: 'test',
        expected: 'expected',
      };

      evaluator.evaluate(input);

      expect(receivedInput).toEqual(input);
    });

    it('should include evaluator name in details when returning boolean', () => {
      const evaluator = new CustomEvaluator(() => true, { name: 'MyCustomEvaluator' });
      const input: EvaluationInput = {
        output: 'test',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.details.evaluator).toBe('MyCustomEvaluator');
    });

    it('should use default name when not provided', () => {
      const evaluator = new CustomEvaluator(() => true);
      const input: EvaluationInput = {
        output: 'test',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.details.evaluator).toBe('CustomEvaluator');
    });

    it('should handle complex custom logic', () => {
      const evaluator = new CustomEvaluator((input) => {
        if (typeof input.output !== 'number' || typeof input.expected !== 'number') {
          return false;
        }
        return (input.output as number) > (input.expected as number);
      });

      const input: EvaluationInput = {
        output: 10,
        expected: 5,
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should handle custom function with context', () => {
      const evaluator = new CustomEvaluator((input) => ({
        passed: true,
        details: {
          output: input.output,
          expected: input.expected,
          timestamp: Date.now(),
        },
      }));

      const input: EvaluationInput = {
        output: 'test',
        expected: 'expected',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
      expect(result.details.output).toBe('test');
      expect(result.details.timestamp).toBeDefined();
    });
  });

  describe('getName', () => {
    it('should return custom name', () => {
      const evaluator = new CustomEvaluator(() => true, { name: 'MyEvaluator' });

      expect(evaluator.getName()).toBe('MyEvaluator');
    });

    it('should return default name when not provided', () => {
      const evaluator = new CustomEvaluator(() => true);

      expect(evaluator.getName()).toBe('CustomEvaluator');
    });
  });

  describe('getDescription', () => {
    it('should return custom description', () => {
      const evaluator = new CustomEvaluator(() => true, {
        description: 'A custom evaluator for testing',
      });

      expect(evaluator.getDescription()).toBe('A custom evaluator for testing');
    });

    it('should return undefined when description not provided', () => {
      const evaluator = new CustomEvaluator(() => true);

      expect(evaluator.getDescription()).toBeUndefined();
    });
  });

  describe('use cases', () => {
    it('should support length-based validation', () => {
      const evaluator = new CustomEvaluator((input) => {
        const minLength = input.expected as number;
        const actualLength = (input.output as string).length;
        return actualLength >= minLength;
      });

      const input: EvaluationInput = {
        output: 'hello world',
        expected: 5,
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should support range validation', () => {
      const evaluator = new CustomEvaluator((input) => {
        const value = input.output as number;
        const range = input.expected as { min: number; max: number };
        return value >= range.min && value <= range.max;
      });

      const input: EvaluationInput = {
        output: 50,
        expected: { min: 0, max: 100 },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should support array contains validation', () => {
      const evaluator = new CustomEvaluator((input) => {
        const array = input.output as unknown[];
        const item = input.expected;
        return array.includes(item);
      });

      const input: EvaluationInput = {
        output: [1, 2, 3, 4, 5],
        expected: 3,
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });
  });
});
