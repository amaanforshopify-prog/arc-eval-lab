/**
 * Regex evaluator
 * Evaluates whether the output matches a regex pattern
 */

import { BaseEvaluator, type EvaluationInput } from './base.js';

export interface RegexOptions {
  flags?: string;
  multiline?: boolean;
  ignoreCase?: boolean;
  dotAll?: boolean;
}

export class RegexEvaluator extends BaseEvaluator {
  private options: Required<RegexOptions>;
  private pattern: RegExp;

  constructor(pattern: string | RegExp, options: RegexOptions = {}) {
    super();
    this.options = {
      flags: options.flags ?? '',
      multiline: options.multiline ?? false,
      ignoreCase: options.ignoreCase ?? false,
      dotAll: options.dotAll ?? false,
    };

    let flags = this.options.flags;
    if (this.options.multiline && !flags.includes('m')) {
      flags += 'm';
    }
    if (this.options.ignoreCase && !flags.includes('i')) {
      flags += 'i';
    }
    if (this.options.dotAll && !flags.includes('s')) {
      flags += 's';
    }

    if (pattern instanceof RegExp) {
      this.pattern = new RegExp(pattern.source, flags || pattern.flags);
    } else {
      this.pattern = new RegExp(pattern, flags);
    }
  }

  evaluate(input: EvaluationInput) {
    const { output, expected } = input;

    if (typeof output !== 'string') {
      return this.createResult(false, {
        reason: 'Output must be a string',
        output,
      });
    }

    const pattern = typeof expected === 'string' ? expected : this.pattern.source;
    const regex = new RegExp(pattern, this.pattern.flags);

    const passed = regex.test(output);

    return this.createResult(passed, {
      output,
      pattern,
      flags: this.pattern.flags,
      match: passed ? output.match(regex)?.[0] : undefined,
    });
  }
}
