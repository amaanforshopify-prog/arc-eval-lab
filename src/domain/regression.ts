/**
 * Regression domain model
 * Represents regression detection and comparison between evaluation runs
 */

export interface BaselineRun {
  runId: string;
  metrics: Record<string, number>;
  timestamp: Date;
}

export interface RegressionThreshold {
  metric: string;
  threshold: number;
  direction: 'increase' | 'decrease';
}

export interface RegressionReport {
  id: string;
  baselineRunId: string;
  currentRunId: string;
  regressions: RegressionIssue[];
  improvements: RegressionIssue[];
  stable: string[];
  generatedAt: Date;
}

export interface RegressionIssue {
  metric: string;
  baselineValue: number;
  currentValue: number;
  delta: number;
  deltaPercent: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  threshold?: number;
}
