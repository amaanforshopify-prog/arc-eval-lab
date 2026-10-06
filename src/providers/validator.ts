/**
 * Provider validator
 * Validates provider configurations and responses
 */

import type { ProviderConfig, ProviderResponse } from '../domain/provider.js';

export interface ValidationError {
  path: string;
  message: string;
  code: string;
}

export class ProviderValidator {
  validateConfig(config: ProviderConfig): ValidationError[] {
    const errors: ValidationError[] = [];

    if (config.timeout !== undefined) {
      if (typeof config.timeout !== 'number') {
        errors.push({
          path: 'timeout',
          message: 'timeout must be a number',
          code: 'INVALID_TYPE',
        });
      } else if (config.timeout <= 0) {
        errors.push({
          path: 'timeout',
          message: 'timeout must be greater than 0',
          code: 'INVALID_VALUE',
        });
      } else if (config.timeout > 300000) {
        errors.push({
          path: 'timeout',
          message: 'timeout must not exceed 300000ms (5 minutes)',
          code: 'INVALID_VALUE',
        });
      }
    }

    if (config.maxRetries !== undefined) {
      if (typeof config.maxRetries !== 'number') {
        errors.push({
          path: 'maxRetries',
          message: 'maxRetries must be a number',
          code: 'INVALID_TYPE',
        });
      } else if (config.maxRetries < 0) {
        errors.push({
          path: 'maxRetries',
          message: 'maxRetries must be non-negative',
          code: 'INVALID_VALUE',
        });
      } else if (config.maxRetries > 10) {
        errors.push({
          path: 'maxRetries',
          message: 'maxRetries must not exceed 10',
          code: 'INVALID_VALUE',
        });
      }
    }

    return errors;
  }

  validateResponse(response: ProviderResponse): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!response.output && response.output !== 0 && response.output !== false) {
      errors.push({
        path: 'output',
        message: 'output is required',
        code: 'MISSING_FIELD',
      });
    }

    if (response.latency !== undefined) {
      if (typeof response.latency !== 'number') {
        errors.push({
          path: 'latency',
          message: 'latency must be a number',
          code: 'INVALID_TYPE',
        });
      } else if (response.latency < 0) {
        errors.push({
          path: 'latency',
          message: 'latency must be non-negative',
          code: 'INVALID_VALUE',
        });
      }
    }

    if (response.tokenUsage !== undefined) {
      const tokenErrors = this.validateTokenUsage(response.tokenUsage);
      tokenErrors.forEach((error) => {
        errors.push({
          ...error,
          path: `tokenUsage.${error.path}`,
        });
      });
    }

    return errors;
  }

  private validateTokenUsage(tokenUsage: unknown): ValidationError[] {
    const errors: ValidationError[] = [];

    if (tokenUsage === null) {
      errors.push({
        path: '',
        message: 'tokenUsage cannot be null',
        code: 'INVALID_TYPE',
      });
      return errors;
    }

    if (typeof tokenUsage !== 'object') {
      errors.push({
        path: '',
        message: 'tokenUsage must be an object',
        code: 'INVALID_TYPE',
      });
      return errors;
    }

    const usage = tokenUsage as Record<string, unknown>;

    if (usage.promptTokens !== undefined) {
      if (typeof usage.promptTokens !== 'number') {
        errors.push({
          path: 'promptTokens',
          message: 'promptTokens must be a number',
          code: 'INVALID_TYPE',
        });
      } else if (usage.promptTokens < 0) {
        errors.push({
          path: 'promptTokens',
          message: 'promptTokens must be non-negative',
          code: 'INVALID_VALUE',
        });
      }
    }

    if (usage.completionTokens !== undefined) {
      if (typeof usage.completionTokens !== 'number') {
        errors.push({
          path: 'completionTokens',
          message: 'completionTokens must be a number',
          code: 'INVALID_TYPE',
        });
      } else if (usage.completionTokens < 0) {
        errors.push({
          path: 'completionTokens',
          message: 'completionTokens must be non-negative',
          code: 'INVALID_VALUE',
        });
      }
    }

    if (usage.totalTokens !== undefined) {
      if (typeof usage.totalTokens !== 'number') {
        errors.push({
          path: 'totalTokens',
          message: 'totalTokens must be a number',
          code: 'INVALID_TYPE',
        });
      } else if (usage.totalTokens < 0) {
        errors.push({
          path: 'totalTokens',
          message: 'totalTokens must be non-negative',
          code: 'INVALID_VALUE',
        });
      }
    }

    return errors;
  }
}
