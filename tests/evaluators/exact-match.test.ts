import { describe, it, expect } from 'vitest';
import { ExactMatchEvaluator } from '../../src/evaluators/exact-match.js';
import type { EvaluationInput } from '../../src/evaluators/base.js';

describe('ExactMatchEvaluator', () => {
  describe('evaluate', () => {
    it('should pass when output exactly matches expected', () => {
      const evaluator = new ExactMatchEvaluator();
      const input: EvaluationInput = {
        output: 'test',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should fail when output does not match expected', () => {
      const evaluator = new ExactMatchEvaluator();
      const input: EvaluationInput = {
        output: 'test',
        expected: 'different',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
    });

    it('should trim whitespace by default', () => {
      const evaluator = new ExactMatchEvaluator();
      const input: EvaluationInput = {
        output: '  test  ',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should not trim whitespace when disabled', () => {
      const evaluator = new ExactMatchEvaluator({ trimWhitespace: false });
      const input: EvaluationInput = {
        output: '  test  ',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
    });

    it('should be case sensitive by default', () => {
      const evaluator = new ExactMatchEvaluator();
      const input: EvaluationInput = {
        output: 'Test',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
    });

    it('should be case insensitive when disabled', () => {
      const evaluator = new ExactMatchEvaluator({ caseSensitive: false });
      const input: EvaluationInput = {
        output: 'Test',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should not use strict type check by default', () => {
      const evaluator = new ExactMatchEvaluator();
      const input: EvaluationInput = {
        output: '123',
        expected: 123,
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should use strict type check when enabled', () => {
      const evaluator = new ExactMatchEvaluator({ strictTypeCheck: true });
      const input: EvaluationInput = {
        output: '123',
        expected: 123,
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
    });

    it('should handle number comparisons', () => {
      const evaluator = new ExactMatchEvaluator();
      const input: EvaluationInput = {
        output: 42,
        expected: 42,
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should handle boolean comparisons', () => {
      const evaluator = new ExactMatchEvaluator();
      const input: EvaluationInput = {
        output: true,
        expected: true,
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should handle null comparisons', () => {
      const evaluator = new ExactMatchEvaluator();
      const input: EvaluationInput = {
        output: null,
        expected: null,
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should handle object comparisons', () => {
      const evaluator = new ExactMatchEvaluator();
      const input: EvaluationInput = {
        output: { key: 'value' },
        expected: { key: 'value' },
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should handle array comparisons', () => {
      const evaluator = new ExactMatchEvaluator();
      const input: EvaluationInput = {
        output: [1, 2, 3],
        expected: [1, 2, 3],
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should include details in result', () => {
      const evaluator = new ExactMatchEvaluator();
      const input: EvaluationInput = {
        output: 'test',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.details).toBeDefined();
      expect(result.details.output).toBe('test');
      expect(result.details.expected).toBe('test');
      expect(result.details.options).toBeDefined();
    });

    it('should apply all options together', () => {
      const evaluator = new ExactMatchEvaluator({
        caseSensitive: false,
        trimWhitespace: true,
        strictTypeCheck: false,
      });

      const input: EvaluationInput = {
        output: '  TEST  ',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });
  });
});
