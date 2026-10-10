import { describe, it, expect } from 'vitest';
import { ContainsEvaluator } from '../../src/evaluators/contains.js';
import type { EvaluationInput } from '../../src/evaluators/base.js';

describe('ContainsEvaluator', () => {
  describe('evaluate', () => {
    it('should pass when output contains expected', () => {
      const evaluator = new ContainsEvaluator();
      const input: EvaluationInput = {
        output: 'hello world',
        expected: 'world',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should fail when output does not contain expected', () => {
      const evaluator = new ContainsEvaluator();
      const input: EvaluationInput = {
        output: 'hello world',
        expected: 'foo',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
    });

    it('should trim whitespace by default', () => {
      const evaluator = new ContainsEvaluator();
      const input: EvaluationInput = {
        output: '  hello world  ',
        expected: 'world',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should not trim whitespace when disabled', () => {
      const evaluator = new ContainsEvaluator({ trimWhitespace: false });
      const input: EvaluationInput = {
        output: '  hello  ',
        expected: 'hello',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should be case sensitive by default', () => {
      const evaluator = new ContainsEvaluator();
      const input: EvaluationInput = {
        output: 'Hello World',
        expected: 'world',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
    });

    it('should be case insensitive when disabled', () => {
      const evaluator = new ContainsEvaluator({ caseSensitive: false });
      const input: EvaluationInput = {
        output: 'Hello World',
        expected: 'world',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should fail when output is not a string', () => {
      const evaluator = new ContainsEvaluator();
      const input: EvaluationInput = {
        output: 123,
        expected: '123',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
      expect(result.details.reason).toBeDefined();
    });

    it('should fail when expected is not a string', () => {
      const evaluator = new ContainsEvaluator();
      const input: EvaluationInput = {
        output: '123',
        expected: 123,
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
      expect(result.details.reason).toBeDefined();
    });

    it('should match single expected by default', () => {
      const evaluator = new ContainsEvaluator();
      const input: EvaluationInput = {
        output: 'hello world',
        expected: 'world',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should match all when matchAll is enabled', () => {
      const evaluator = new ContainsEvaluator({ matchAll: true });
      const input: EvaluationInput = {
        output: 'hello world foo bar',
        expected: 'world, foo',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should fail when not all match with matchAll enabled', () => {
      const evaluator = new ContainsEvaluator({ matchAll: true });
      const input: EvaluationInput = {
        output: 'hello world foo',
        expected: 'world, bar',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
    });

    it('should handle empty strings', () => {
      const evaluator = new ContainsEvaluator();
      const input: EvaluationInput = {
        output: '',
        expected: '',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should include details in result', () => {
      const evaluator = new ContainsEvaluator();
      const input: EvaluationInput = {
        output: 'hello world',
        expected: 'world',
      };

      const result = evaluator.evaluate(input);

      expect(result.details).toBeDefined();
      expect(result.details.output).toBe('hello world');
      expect(result.details.expected).toBe('world');
      expect(result.details.options).toBeDefined();
    });

    it('should apply all options together', () => {
      const evaluator = new ContainsEvaluator({
        caseSensitive: false,
        trimWhitespace: true,
        matchAll: false,
      });

      const input: EvaluationInput = {
        output: '  HELLO WORLD  ',
        expected: 'world',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should handle comma-separated expected values with matchAll', () => {
      const evaluator = new ContainsEvaluator({ matchAll: true });
      const input: EvaluationInput = {
        output: 'The quick brown fox jumps over the lazy dog',
        expected: 'quick, fox, lazy',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should trim parts in matchAll mode', () => {
      const evaluator = new ContainsEvaluator({ matchAll: true });
      const input: EvaluationInput = {
        output: 'hello world foo',
        expected: ' world , foo ',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });
  });
});
