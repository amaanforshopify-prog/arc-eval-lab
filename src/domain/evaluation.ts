/**
 * Evaluation domain model
 * Represents evaluation cases, runs, and results
 */

export interface EvaluationCase {
  id: string;
  datasetId: string;
  datasetItemId: string;
  input: unknown;
  expectedOutput?: unknown;
  metadata?: Record<string, unknown>;
}

export interface EvaluationRun {
  id: string;
  datasetId: string;
  providerId: string;
  evaluatorId: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  startedAt?: Date;
  completedAt?: Date;
  metadata?: Record<string, unknown>;
}

export interface EvaluationResult {
  id: string;
  runId: string;
  caseId: string;
  actualOutput: unknown;
  passed: boolean;
  score?: number;
  error?: string;
  latency?: number;
  metadata?: Record<string, unknown>;
  evaluatedAt: Date;
}

export interface EvaluationSummary {
  runId: string;
  totalCases: number;
  passed: number;
  failed: number;
  skipped: number;
  passRate: number;
  averageLatency?: number;
}
