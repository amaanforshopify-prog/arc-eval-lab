/**
 * Mock provider
 * A simple provider that returns predefined responses for testing
 */

import { BaseProvider } from './provider.js';
import type { ProviderRequest, ProviderResponse } from '../domain/provider.js';

export interface MockResponse {
  output: unknown;
  latency?: number;
  error?: string;
}

export class MockProvider extends BaseProvider {
  private responses: Map<string, MockResponse> = new Map();
  private defaultResponse: MockResponse = { output: 'Mock response' };

  setResponse(input: unknown, response: MockResponse): void {
    this.responses.set(JSON.stringify(input), response);
  }

  setDefaultResponse(response: MockResponse): void {
    this.defaultResponse = response;
  }

  clearResponses(): void {
    this.responses.clear();
  }

  async execute(request: ProviderRequest): Promise<ProviderResponse> {
    const inputKey = JSON.stringify(request.input);
    const mockResponse = this.responses.get(inputKey) || this.defaultResponse;

    if (mockResponse.error) {
      throw new Error(mockResponse.error);
    }

    const startTime = Date.now();
    const latency = mockResponse.latency ?? 0;

    if (latency > 0) {
      await new Promise((resolve) => setTimeout(resolve, latency));
    }

    return {
      output: mockResponse.output,
      latency: Date.now() - startTime,
      metadata: {
        provider: 'mock',
        inputKey,
      },
    };
  }
}
