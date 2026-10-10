import { describe, it, expect } from 'vitest';
import { RegexEvaluator } from '../../src/evaluators/regex.js';
import type { EvaluationInput } from '../../src/evaluators/base.js';

describe('RegexEvaluator', () => {
  describe('evaluate', () => {
    it('should pass when output matches pattern', () => {
      const evaluator = new RegexEvaluator('\\d+');
      const input: EvaluationInput = {
        output: 'test 123',
        expected: '\\d+',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should fail when output does not match pattern', () => {
      const evaluator = new RegexEvaluator('\\d+');
      const input: EvaluationInput = {
        output: 'test abc',
        expected: '\\d+',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
    });

    it('should use constructor pattern when expected is not a string', () => {
      const evaluator = new RegexEvaluator('\\d+');
      const input: EvaluationInput = {
        output: 'test 123',
        expected: 123,
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should accept RegExp as pattern', () => {
      const evaluator = new RegexEvaluator(/\d+/);
      const input: EvaluationInput = {
        output: 'test 123',
        expected: '\\d+',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should fail when output is not a string', () => {
      const evaluator = new RegexEvaluator('\\d+');
      const input: EvaluationInput = {
        output: 123,
        expected: '\\d+',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
      expect(result.details.reason).toBeDefined();
    });

    it('should support ignore case flag', () => {
      const evaluator = new RegexEvaluator('hello', { ignoreCase: true });
      const input: EvaluationInput = {
        output: 'HELLO',
        expected: 'hello',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should support multiline flag', () => {
      const evaluator = new RegexEvaluator('^test', { multiline: true });
      const input: EvaluationInput = {
        output: 'line1\ntest',
        expected: '^test',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should support dotAll flag', () => {
      const evaluator = new RegexEvaluator('test.*end', { dotAll: true });
      const input: EvaluationInput = {
        output: 'test\nend',
        expected: 'test.*end',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should support custom flags', () => {
      const evaluator = new RegexEvaluator('test', { flags: 'gi' });
      const input: EvaluationInput = {
        output: 'TEST',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should include match in details when passed', () => {
      const evaluator = new RegexEvaluator('\\d+');
      const input: EvaluationInput = {
        output: 'test 123',
        expected: '\\d+',
      };

      const result = evaluator.evaluate(input);

      expect(result.details.match).toBe('123');
    });

    it('should not include match in details when failed', () => {
      const evaluator = new RegexEvaluator('\\d+');
      const input: EvaluationInput = {
        output: 'test abc',
        expected: '\\d+',
      };

      const result = evaluator.evaluate(input);

      expect(result.details.match).toBeUndefined();
    });

    it('should include pattern and flags in details', () => {
      const evaluator = new RegexEvaluator('\\d+', { ignoreCase: true });
      const input: EvaluationInput = {
        output: 'test 123',
        expected: '\\d+',
      };

      const result = evaluator.evaluate(input);

      expect(result.details.pattern).toBe('\\d+');
      expect(result.details.flags).toContain('i');
    });

    it('should handle complex patterns', () => {
      const evaluator = new RegexEvaluator('^[a-z]+@[a-z]+\\.[a-z]+$');
      const input: EvaluationInput = {
        output: 'test@example.com',
        expected: '^[a-z]+@[a-z]+\\.[a-z]+$',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should handle empty string output', () => {
      const evaluator = new RegexEvaluator('.+');
      const input: EvaluationInput = {
        output: '',
        expected: '.+',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
    });

    it('should handle empty pattern', () => {
      const evaluator = new RegexEvaluator('');
      const input: EvaluationInput = {
        output: 'test',
        expected: '',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should combine custom flags with option flags', () => {
      const evaluator = new RegexEvaluator('test', { flags: 'g', ignoreCase: true });
      const input: EvaluationInput = {
        output: 'TEST',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
      expect(result.details.flags).toContain('g');
      expect(result.details.flags).toContain('i');
    });
  });
});
