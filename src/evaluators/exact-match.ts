/**
 * Exact match evaluator
 * Evaluates whether the output exactly matches the expected value
 */

import { BaseEvaluator, type EvaluationInput } from './base.js';

export interface ExactMatchOptions {
  caseSensitive?: boolean;
  trimWhitespace?: boolean;
  strictTypeCheck?: boolean;
}

export class ExactMatchEvaluator extends BaseEvaluator {
  private options: Required<ExactMatchOptions>;

  constructor(options: ExactMatchOptions = {}) {
    super();
    this.options = {
      caseSensitive: options.caseSensitive ?? true,
      trimWhitespace: options.trimWhitespace ?? true,
      strictTypeCheck: options.strictTypeCheck ?? false,
    };
  }

  evaluate(input: EvaluationInput) {
    const { output, expected } = input;

    let actualOutput = output;
    let actualExpected = expected;

    if (this.options.trimWhitespace) {
      if (typeof actualOutput === 'string') {
        actualOutput = actualOutput.trim();
      }
      if (typeof actualExpected === 'string') {
        actualExpected = actualExpected.trim();
      }
    }

    if (!this.options.caseSensitive) {
      if (typeof actualOutput === 'string') {
        actualOutput = actualOutput.toLowerCase();
      }
      if (typeof actualExpected === 'string') {
        actualExpected = actualExpected.toLowerCase();
      }
    }

    let passed: boolean;
    if (this.options.strictTypeCheck) {
      passed = actualOutput === actualExpected;
    } else {
      if (typeof actualOutput === 'object' && actualOutput !== null &&
          typeof actualExpected === 'object' && actualExpected !== null) {
        passed = JSON.stringify(actualOutput) === JSON.stringify(actualExpected);
      } else {
        passed = actualOutput == actualExpected;
      }
    }

    return this.createResult(passed, {
      output: actualOutput,
      expected: actualExpected,
      options: this.options,
    });
  }
}
