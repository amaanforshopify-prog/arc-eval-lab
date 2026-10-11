/**
 * Evaluator composition
 * Allows combining multiple evaluators with AND/OR logic
 */

import { BaseEvaluator, type EvaluationInput, type EvaluationResult } from './base.js';

export type CompositionMode = 'and' | 'or' | 'all' | 'any';

export interface CompositionOptions {
  mode?: CompositionMode;
  stopOnFirst?: boolean;
}

export class CompositeEvaluator extends BaseEvaluator {
  private evaluators: BaseEvaluator[];
  private options: Required<CompositionOptions>;

  constructor(evaluators: BaseEvaluator[], options: CompositionOptions = {}) {
    super();
    this.evaluators = evaluators;
    this.options = {
      mode: options.mode ?? 'and',
      stopOnFirst: options.stopOnFirst ?? false,
    };
  }

  evaluate(input: EvaluationInput): EvaluationResult {
    const results: EvaluationResult[] = [];
    let allPassed = true;
    let anyPassed = false;

    for (const evaluator of this.evaluators) {
      const result = evaluator.evaluate(input);
      results.push(result);

      if (!result.passed) {
        allPassed = false;
      } else {
        anyPassed = true;
      }

      // Early exit if configured
      if (this.options.stopOnFirst) {
        if (this.options.mode === 'and' && !result.passed) {
          break;
        }
        if (this.options.mode === 'or' && result.passed) {
          break;
        }
      }
    }

    let passed: boolean;
    switch (this.options.mode) {
      case 'and':
      case 'all':
        passed = allPassed;
        break;
      case 'or':
      case 'any':
        passed = anyPassed;
        break;
      default:
        passed = allPassed;
    }

    return this.createResult(passed, {
      mode: this.options.mode,
      evaluatorCount: this.evaluators.length,
      results,
      allPassed,
      anyPassed,
    });
  }

  addEvaluator(evaluator: BaseEvaluator): void {
    this.evaluators.push(evaluator);
  }

  removeEvaluator(index: number): void {
    this.evaluators.splice(index, 1);
  }

  getEvaluators(): BaseEvaluator[] {
    return [...this.evaluators];
  }

  getEvaluatorCount(): number {
    return this.evaluators.length;
  }
}
