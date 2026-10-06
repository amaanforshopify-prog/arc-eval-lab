/**
 * Provider response normalizer
 * Normalizes provider responses to a consistent format
 */

import type { ProviderResponse } from '../domain/provider.js';

export interface NormalizationOptions {
  trimStrings?: boolean;
  normalizeWhitespace?: boolean;
  lowercaseKeys?: boolean;
  removeNulls?: boolean;
}

export class ProviderResponseNormalizer {
  normalize(
    response: ProviderResponse,
    options: NormalizationOptions = {},
  ): ProviderResponse {
    const opts: Required<NormalizationOptions> = {
      trimStrings: options.trimStrings ?? true,
      normalizeWhitespace: options.normalizeWhitespace ?? true,
      lowercaseKeys: options.lowercaseKeys ?? false,
      removeNulls: options.removeNulls ?? false,
    };

    return {
      output: this.normalizeValue(response.output, opts),
      latency: response.latency,
      tokenUsage: response.tokenUsage,
      metadata: response.metadata,
    };
  }

  private normalizeValue(value: unknown, options: NormalizationOptions): unknown {
    if (typeof value === 'string') {
      let result = value;

      if (options.normalizeWhitespace) {
        result = result.replace(/\s+/g, ' ');
      }

      if (options.trimStrings) {
        result = result.trim();
      }

      return result;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.normalizeValue(item, options));
    }

    if (value && typeof value === 'object') {
      const normalized: Record<string, unknown> = {};

      for (const [key, val] of Object.entries(value)) {
        let normalizedKey = key;
        if (options.lowercaseKeys) {
          normalizedKey = key.trim().toLowerCase();
        }

        if (options.removeNulls && val === null) {
          continue;
        }

        normalized[normalizedKey] = this.normalizeValue(val, options);
      }

      return normalized;
    }

    return value;
  }
}
