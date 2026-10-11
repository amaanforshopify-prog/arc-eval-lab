import { describe, it, expect } from 'vitest';
import { CompositeEvaluator } from '../../src/evaluators/composition.js';
import { ExactMatchEvaluator } from '../../src/evaluators/exact-match.js';
import { ContainsEvaluator } from '../../src/evaluators/contains.js';
import type { EvaluationInput } from '../../src/evaluators/base.js';

describe('CompositeEvaluator', () => {
  describe('evaluate', () => {
    it('should pass when all evaluators pass in AND mode', () => {
      const evaluator = new CompositeEvaluator([
        new ExactMatchEvaluator(),
        new ContainsEvaluator(),
      ], { mode: 'and' });

      const input: EvaluationInput = {
        output: 'test',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
      expect(result.details.allPassed).toBe(true);
    });

    it('should fail when any evaluator fails in AND mode', () => {
      const evaluator = new CompositeEvaluator([
        new ExactMatchEvaluator(),
        new ContainsEvaluator(),
      ], { mode: 'and' });

      const input: EvaluationInput = {
        output: 'test',
        expected: 'different',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
      expect(result.details.allPassed).toBe(false);
    });

    it('should pass when any evaluator passes in OR mode', () => {
      const evaluator = new CompositeEvaluator([
        new ExactMatchEvaluator(),
        new ContainsEvaluator(),
      ], { mode: 'or' });

      const input: EvaluationInput = {
        output: 'hello world',
        expected: 'world',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
      expect(result.details.anyPassed).toBe(true);
    });

    it('should fail when all evaluators fail in OR mode', () => {
      const evaluator = new CompositeEvaluator([
        new ExactMatchEvaluator(),
        new ContainsEvaluator(),
      ], { mode: 'or' });

      const input: EvaluationInput = {
        output: 'test',
        expected: 'xyz',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
      expect(result.details.anyPassed).toBe(false);
    });

    it('should work with ALL mode (same as AND)', () => {
      const evaluator = new CompositeEvaluator([
        new ExactMatchEvaluator(),
        new ContainsEvaluator(),
      ], { mode: 'all' });

      const input: EvaluationInput = {
        output: 'test',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should work with ANY mode (same as OR)', () => {
      const evaluator = new CompositeEvaluator([
        new ExactMatchEvaluator(),
        new ContainsEvaluator(),
      ], { mode: 'any' });

      const input: EvaluationInput = {
        output: 'hello world',
        expected: 'world',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should include all evaluator results in details', () => {
      const evaluator = new CompositeEvaluator([
        new ExactMatchEvaluator(),
        new ContainsEvaluator(),
      ]);

      const input: EvaluationInput = {
        output: 'test',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.details.results).toHaveLength(2);
      expect(result.details.evaluatorCount).toBe(2);
    });

    it('should handle empty evaluator list', () => {
      const evaluator = new CompositeEvaluator([]);
      const input: EvaluationInput = {
        output: 'test',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
      expect(result.details.evaluatorCount).toBe(0);
    });

    it('should use AND mode by default', () => {
      const evaluator = new CompositeEvaluator([
        new ExactMatchEvaluator(),
      ]);

      const input: EvaluationInput = {
        output: 'test',
        expected: 'test',
      };

      const result = evaluator.evaluate(input);

      expect(result.details.mode).toBe('and');
    });

    it('should stop on first failure in AND mode with stopOnFirst', () => {
      const evaluator = new CompositeEvaluator([
        new ExactMatchEvaluator(),
        new ContainsEvaluator(),
      ], { mode: 'and', stopOnFirst: true });

      const input: EvaluationInput = {
        output: 'test',
        expected: 'different',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
      expect(result.details.results).toHaveLength(1);
    });

    it('should stop on first success in OR mode with stopOnFirst', () => {
      const evaluator = new CompositeEvaluator([
        new ContainsEvaluator(),
        new ExactMatchEvaluator(),
      ], { mode: 'or', stopOnFirst: true });

      const input: EvaluationInput = {
        output: 'hello world',
        expected: 'world',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
      expect(result.details.results).toHaveLength(1);
    });

    it('should not stop early when stopOnFirst is false', () => {
      const evaluator = new CompositeEvaluator([
        new ExactMatchEvaluator(),
        new ContainsEvaluator(),
      ], { mode: 'and', stopOnFirst: false });

      const input: EvaluationInput = {
        output: 'test',
        expected: 'different',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(false);
      expect(result.details.results).toHaveLength(2);
    });
  });

  describe('addEvaluator', () => {
    it('should add evaluator to the list', () => {
      const evaluator = new CompositeEvaluator([new ExactMatchEvaluator()]);
      evaluator.addEvaluator(new ContainsEvaluator());

      expect(evaluator.getEvaluatorCount()).toBe(2);
    });
  });

  describe('removeEvaluator', () => {
    it('should remove evaluator by index', () => {
      const evaluator = new CompositeEvaluator([
        new ExactMatchEvaluator(),
        new ContainsEvaluator(),
      ]);

      evaluator.removeEvaluator(0);

      expect(evaluator.getEvaluatorCount()).toBe(1);
    });
  });

  describe('getEvaluators', () => {
    it('should return copy of evaluators', () => {
      const evaluator1 = new ExactMatchEvaluator();
      const evaluator2 = new ContainsEvaluator();
      const composite = new CompositeEvaluator([evaluator1, evaluator2]);

      const evaluators = composite.getEvaluators();

      expect(evaluators).toHaveLength(2);
      expect(evaluators).not.toBe(composite['evaluators']);
    });
  });

  describe('getEvaluatorCount', () => {
    it('should return correct count', () => {
      const evaluator = new CompositeEvaluator([
        new ExactMatchEvaluator(),
        new ContainsEvaluator(),
      ]);

      expect(evaluator.getEvaluatorCount()).toBe(2);
    });
  });

  describe('complex scenarios', () => {
    it('should combine multiple evaluators with different logic', () => {
      const evaluator = new CompositeEvaluator([
        new ExactMatchEvaluator({ trimWhitespace: true }),
        new ContainsEvaluator({ caseSensitive: false }),
      ], { mode: 'or' });

      const input: EvaluationInput = {
        output: 'HELLO WORLD',
        expected: 'hello',
      };

      const result = evaluator.evaluate(input);

      expect(result.passed).toBe(true);
    });

    it('should handle nested composition', () => {
      const inner1 = new CompositeEvaluator([
        new ExactMatchEvaluator(),
        new ContainsEvaluator(),
      ], { mode: 'and' });

      const inner2 = new CompositeEvaluator([
        new ContainsEvaluator(),
      ], { mode: 'or' });

      const outer = new CompositeEvaluator([inner1, inner2], { mode: 'and' });

      const input: EvaluationInput = {
        output: 'test',
        expected: 'test',
      };

      const result = outer.evaluate(input);

      expect(result.passed).toBe(true);
    });
  });
});
