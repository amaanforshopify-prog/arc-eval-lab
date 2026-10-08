/**
 * Base evaluator interface
 * Abstract base class for all evaluators
 */

import type { EvaluatorResult, EvaluationContext } from '../domain/evaluator.js';

export interface EvaluationInput {
  output: unknown;
  expected: unknown;
  context?: EvaluationContext;
}

export abstract class BaseEvaluator {
  abstract evaluate(input: EvaluationInput): EvaluatorResult;

  protected createContext(
    input: EvaluationInput,
    additionalContext?: Record<string, unknown>,
  ): EvaluationContext {
    return {
      ...input.context,
      ...additionalContext,
      evaluator: this.constructor.name,
      timestamp: new Date().toISOString(),
    };
  }

  protected createResult(
    passed: boolean,
    details?: Record<string, unknown>,
  ): EvaluatorResult {
    return {
      passed,
      details: details || {},
    };
  }
}
