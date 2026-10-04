/**
 * Deterministic local provider
 * A provider that returns deterministic responses based on input hash
 */

import { BaseProvider } from './provider.js';
import type { ProviderRequest, ProviderResponse } from '../domain/provider.js';

export interface DeterministicConfig {
  seed?: string;
  latency?: number;
  responseTemplate?: (input: unknown, hash: string) => unknown;
}

export class DeterministicProvider extends BaseProvider {
  private seed: string;
  private responseTemplate?: (input: unknown, hash: string) => unknown;
  private latency: number;

  constructor(config: DeterministicConfig = {}) {
    super({});
    this.seed = config.seed || 'default-seed';
    this.responseTemplate = config.responseTemplate;
    this.latency = config.latency || 0;
  }

  async execute(request: ProviderRequest): Promise<ProviderResponse> {
    const hash = this.hashInput(request.input);
    const startTime = Date.now();

    const output = this.responseTemplate
      ? this.responseTemplate(request.input, hash)
      : this.defaultResponseTemplate(request.input, hash);

    if (this.latency > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.latency));
    }

    return {
      output,
      latency: Date.now() - startTime,
      metadata: {
        provider: 'deterministic',
        hash,
        seed: this.seed,
      },
    };
  }

  private hashInput(input: unknown): string {
    const str = JSON.stringify(input) + this.seed;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(16);
  }

  private defaultResponseTemplate(input: unknown, hash: string): string {
    return `Deterministic response for input: ${JSON.stringify(input)} (hash: ${hash})`;
  }
}
