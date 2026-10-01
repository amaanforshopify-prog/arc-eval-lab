import { describe, it, expect } from 'vitest';
import type {
  EvaluatorConfig,
  EvaluatorResult,
  Evaluator,
  EvaluationContext,
} from '../../src/domain/evaluator.js';

describe('Evaluator Domain Model', () => {
  describe('EvaluatorConfig', () => {
    it('should accept minimal config', () => {
      const config: EvaluatorConfig = {};

      expect(config).toBeDefined();
    });

    it('should accept full config', () => {
      const config: EvaluatorConfig = {
        caseSensitive: true,
        threshold: 0.9,
        metadata: { strict: true },
      };

      expect(config.caseSensitive).toBe(true);
      expect(config.threshold).toBe(0.9);
      expect(config.metadata).toEqual({ strict: true });
    });
  });

  describe('EvaluatorResult', () => {
    it('should accept minimal result', () => {
      const result: EvaluatorResult = {
        passed: true,
      };

      expect(result.passed).toBe(true);
    });

    it('should accept result with score', () => {
      const result: EvaluatorResult = {
        passed: true,
        score: 0.95,
      };

      expect(result.score).toBe(0.95);
    });

    it('should accept result with message', () => {
      const result: EvaluatorResult = {
        passed: false,
        message: 'Output does not match expected',
      };

      expect(result.message).toBe('Output does not match expected');
    });

    it('should accept result with details', () => {
      const result: EvaluatorResult = {
        passed: true,
        details: { matchType: 'exact' },
      };

      expect(result.details).toEqual({ matchType: 'exact' });
    });
  });

  describe('Evaluator', () => {
    it('should create evaluator', () => {
      const evaluator: Evaluator = {
        id: 'evaluator-1',
        name: 'Exact Match',
        type: 'exact_match',
        config: {},
      };

      expect(evaluator.id).toBe('evaluator-1');
      expect(evaluator.name).toBe('Exact Match');
      expect(evaluator.type).toBe('exact_match');
    });

    it('should accept all evaluator types', () => {
      const types: Evaluator['type'][] = ['exact_match', 'contains', 'regex', 'json', 'custom'];

      types.forEach((type) => {
        const evaluator: Evaluator = {
          id: `evaluator-${type}`,
          name: type.replace('_', ' '),
          type,
          config: {},
        };
        expect(evaluator.type).toBe(type);
      });
    });

    it('should create evaluator with config', () => {
      const evaluator: Evaluator = {
        id: 'evaluator-1',
        name: 'Exact Match',
        type: 'exact_match',
        config: {
          caseSensitive: false,
          threshold: 1.0,
        },
      };

      expect(evaluator.config.caseSensitive).toBe(false);
      expect(evaluator.config.threshold).toBe(1.0);
    });
  });

  describe('EvaluationContext', () => {
    it('should accept minimal context', () => {
      const context: EvaluationContext = {
        actualOutput: 'actual',
      };

      expect(context.actualOutput).toBe('actual');
    });

    it('should accept context with expected output', () => {
      const context: EvaluationContext = {
        actualOutput: 'actual',
        expectedOutput: 'expected',
      };

      expect(context.expectedOutput).toBe('expected');
    });

    it('should accept context with metadata', () => {
      const context: EvaluationContext = {
        actualOutput: 'actual',
        metadata: { testCase: 'test-1' },
      };

      expect(context.metadata).toEqual({ testCase: 'test-1' });
    });
  });
});
