/**
 * Provider domain model
 * Represents AI model providers for evaluation
 */

export interface ProviderConfig {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
  maxRetries?: number;
  metadata?: Record<string, unknown>;
}

export interface ProviderResponse {
  output: unknown;
  latency?: number;
  tokenUsage?: {
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
  };
  metadata?: Record<string, unknown>;
}

export interface ProviderError {
  message: string;
  code?: string;
  statusCode?: number;
  retryable?: boolean;
}

export interface ModelProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'mock' | 'custom';
  model: string;
  config: ProviderConfig;
}

export interface ProviderRequest {
  input: unknown;
  parameters?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}
