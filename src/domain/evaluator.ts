/**
 * Evaluator domain model
 * Represents evaluation strategies for comparing actual vs expected outputs
 */

export interface EvaluatorConfig {
  caseSensitive?: boolean;
  threshold?: number;
  metadata?: Record<string, unknown>;
}

export interface EvaluatorResult {
  passed: boolean;
  score?: number;
  message?: string;
  details?: Record<string, unknown>;
}

export interface Evaluator {
  id: string;
  name: string;
  type: 'exact_match' | 'contains' | 'regex' | 'json' | 'custom';
  config: EvaluatorConfig;
}

export interface EvaluationContext {
  actualOutput: unknown;
  expectedOutput?: unknown;
  metadata?: Record<string, unknown>;
}
