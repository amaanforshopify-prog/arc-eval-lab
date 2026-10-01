/**
 * Provider abstraction
 * Base interface for all model providers
 */

import type {
  ProviderConfig,
  ProviderResponse,
  ProviderError,
  ProviderRequest,
} from '../domain/provider.js';

export abstract class BaseProvider {
  protected config: ProviderConfig;

  constructor(config: ProviderConfig = {}) {
    this.config = config;
  }

  abstract execute(request: ProviderRequest): Promise<ProviderResponse>;

  protected async withTimeout<T>(
    promise: Promise<T>,
    timeoutMs?: number,
  ): Promise<T> {
    const timeout = timeoutMs ?? this.config.timeout ?? 30000;

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(`Request timeout after ${timeout}ms`)), timeout);
    });

    return Promise.race([promise, timeoutPromise]);
  }

  protected async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries?: number,
  ): Promise<T> {
    const retries = maxRetries ?? this.config.maxRetries ?? 3;
    let lastError: Error | undefined;

    for (let i = 0; i <= retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        if (i === retries) {
          throw lastError;
        }
        // Exponential backoff
        const delay = Math.min(1000 * Math.pow(2, i), 10000);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }

    throw lastError || new Error('Unknown error');
  }

  protected createError(message: string, code?: string, statusCode?: number): ProviderError {
    return {
      message,
      code,
      statusCode,
      retryable: this.isRetryableError(statusCode, code),
    };
  }

  private isRetryableError(statusCode?: number, code?: string): boolean {
    if (statusCode) {
      return statusCode >= 500 || statusCode === 429;
    }
    if (code) {
      return ['rate_limit', 'timeout', 'server_error'].includes(code.toLowerCase());
    }
    return false;
  }
}
