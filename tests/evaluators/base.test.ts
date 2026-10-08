import { describe, it, expect } from 'vitest';
import { BaseEvaluator, type EvaluationInput } from '../../src/evaluators/base.js';

class TestEvaluator extends BaseEvaluator {
  evaluate(input: EvaluationInput) {
    return this.createResult(input.output === input.expected);
  }
}

describe('BaseEvaluator', () => {
  describe('createContext', () => {
    it('should create context with evaluator name and timestamp', () => {
      const evaluator = new TestEvaluator();
      const input: EvaluationInput = {
        output: 'test',
        expected: 'test',
      };

      const context = evaluator['createContext'](input);

      expect(context.evaluator).toBe('TestEvaluator');
      expect(context.timestamp).toBeDefined();
      expect(typeof context.timestamp).toBe('string');
    });

    it('should merge existing context', () => {
      const evaluator = new TestEvaluator();
      const input: EvaluationInput = {
        output: 'test',
        expected: 'test',
        context: { customField: 'value' },
      };

      const context = evaluator['createContext'](input);

      expect(context.customField).toBe('value');
    });

    it('should merge additional context', () => {
      const evaluator = new TestEvaluator();
      const input: EvaluationInput = {
        output: 'test',
        expected: 'test',
      };

      const context = evaluator['createContext'](input, { additional: 'field' });

      expect(context.additional).toBe('field');
    });
  });

  describe('createResult', () => {
    it('should create result with passed status', () => {
      const evaluator = new TestEvaluator();
      const result = evaluator['createResult'](true);

      expect(result.passed).toBe(true);
      expect(result.details).toEqual({});
    });

    it('should create result with details', () => {
      const evaluator = new TestEvaluator();
      const result = evaluator['createResult'](false, { reason: 'mismatch' });

      expect(result.passed).toBe(false);
      expect(result.details).toEqual({ reason: 'mismatch' });
    });
  });
});
