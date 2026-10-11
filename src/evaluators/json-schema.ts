/**
 * JSON schema evaluator
 * Evaluates whether the output matches a JSON schema
 */

import { BaseEvaluator, type EvaluationInput } from './base.js';

export interface JsonSchemaOptions {
  strict?: boolean;
  allowExtraFields?: boolean;
  requireAllFields?: boolean;
}

export class JsonSchemaEvaluator extends BaseEvaluator {
  private options: Required<JsonSchemaOptions>;

  constructor(options: JsonSchemaOptions = {}) {
    super();
    this.options = {
      strict: options.strict ?? false,
      allowExtraFields: options.allowExtraFields ?? true,
      requireAllFields: options.requireAllFields ?? true,
    };
  }

  evaluate(input: EvaluationInput) {
    const { output, expected } = input;

    if (typeof output !== 'object' || output === null || Array.isArray(output)) {
      return this.createResult(false, {
        reason: 'Output must be a non-null object',
        output,
      });
    }

    if (typeof expected !== 'object' || expected === null || Array.isArray(expected)) {
      return this.createResult(false, {
        reason: 'Expected schema must be a non-null object',
        expected,
      });
    }

    const schema = expected as Record<string, unknown>;
    const result = this.validateAgainstSchema(output as Record<string, unknown>, schema);

    return this.createResult(result.passed, {
      ...result.details,
      schema,
    });
  }

  private validateAgainstSchema(
    obj: Record<string, unknown>,
    schema: Record<string, unknown>,
  ): { passed: boolean; details: Record<string, unknown> } {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Check required fields
    if (this.options.requireAllFields) {
      for (const key of Object.keys(schema)) {
        if (!(key in obj)) {
          errors.push(`Missing required field: ${key}`);
        }
      }
    }

    // Check field types
    for (const [key, schemaValue] of Object.entries(schema)) {
      if (!(key in obj)) {
        continue;
      }

      const objValue = obj[key];
      const schemaType = this.getSchemaType(schemaValue);

      if (this.options.strict) {
        const objType = this.getType(objValue);
        if (objType !== schemaType) {
          errors.push(`Field '${key}' type mismatch: expected ${schemaType}, got ${objType}`);
        }
      } else {
        // Non-strict: allow type coercion
        if (!this.isTypeCompatible(objValue, schemaValue)) {
          warnings.push(`Field '${key}' may not match expected type`);
        }
      }
    }

    // Check for extra fields
    if (!this.options.allowExtraFields) {
      for (const key of Object.keys(obj)) {
        if (!(key in schema)) {
          errors.push(`Unexpected field: ${key}`);
        }
      }
    }

    return {
      passed: errors.length === 0,
      details: {
        errors,
        warnings,
      },
    };
  }

  private getType(value: unknown): string {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
  }

  private getSchemaType(schemaValue: unknown): string {
    if (schemaValue === null) return 'null';
    if (typeof schemaValue === 'string') return schemaValue;
    if (Array.isArray(schemaValue)) return 'array';
    if (typeof schemaValue === 'object' && schemaValue !== null) return 'object';
    return typeof schemaValue;
  }

  private isTypeCompatible(objValue: unknown, schemaValue: unknown): boolean {
    const objType = this.getType(objValue);
    const schemaType = this.getSchemaType(schemaValue);

    // Allow number to string conversion and vice versa
    if (objType === 'number' && schemaType === 'string') return true;
    if (objType === 'string' && schemaType === 'number') {
      return !isNaN(Number(objValue));
    }

    return objType === schemaType;
  }
}
