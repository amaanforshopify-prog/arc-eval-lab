/**
 * Contains evaluator
 * Evaluates whether the output contains the expected substring
 */

import { BaseEvaluator, type EvaluationInput } from './base.js';

export interface ContainsOptions {
  caseSensitive?: boolean;
  trimWhitespace?: boolean;
  matchAll?: boolean;
}

export class ContainsEvaluator extends BaseEvaluator {
  private options: Required<ContainsOptions>;

  constructor(options: ContainsOptions = {}) {
    super();
    this.options = {
      caseSensitive: options.caseSensitive ?? true,
      trimWhitespace: options.trimWhitespace ?? true,
      matchAll: options.matchAll ?? false,
    };
  }

  evaluate(input: EvaluationInput) {
    const { output, expected } = input;

    if (typeof output !== 'string' || typeof expected !== 'string') {
      return this.createResult(false, {
        reason: 'Both output and expected must be strings',
        output,
        expected,
      });
    }

    let actualOutput = output;
    let actualExpected = expected;

    if (this.options.trimWhitespace) {
      actualOutput = actualOutput.trim();
      actualExpected = actualExpected.trim();
    }

    if (!this.options.caseSensitive) {
      actualOutput = actualOutput.toLowerCase();
      actualExpected = actualExpected.toLowerCase();
    }

    let passed: boolean;
    if (this.options.matchAll) {
      const expectedParts = actualExpected.split(',').map((p) => p.trim());
      passed = expectedParts.every((part) => actualOutput.includes(part));
    } else {
      passed = actualOutput.includes(actualExpected);
    }

    return this.createResult(passed, {
      output: actualOutput,
      expected: actualExpected,
      options: this.options,
    });
  }
}
