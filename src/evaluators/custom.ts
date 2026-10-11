/**
 * Custom evaluator
 * Allows users to create evaluators from custom functions
 */

import { BaseEvaluator, type EvaluationInput, type EvaluationResult } from './base.js';

export type CustomEvaluateFn = (input: EvaluationInput) => EvaluationResult | boolean;

export interface CustomEvaluatorOptions {
  name?: string;
  description?: string;
}

export class CustomEvaluator extends BaseEvaluator {
  private evaluateFn: CustomEvaluateFn;
  private options: CustomEvaluatorOptions;

  constructor(evaluateFn: CustomEvaluateFn, options: CustomEvaluatorOptions = {}) {
    super();
    this.evaluateFn = evaluateFn;
    this.options = {
      name: options.name ?? 'CustomEvaluator',
      description: options.description,
    };
  }

  evaluate(input: EvaluationInput): EvaluationResult {
    const result = this.evaluateFn(input);

    // If function returns boolean, convert to EvaluationResult
    if (typeof result === 'boolean') {
      return this.createResult(result, {
        evaluator: this.options.name,
      });
    }

    return result;
  }

  getName(): string {
    return this.options.name;
  }

  getDescription(): string | undefined {
    return this.options.description;
  }
}
