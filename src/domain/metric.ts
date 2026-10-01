/**
 * Metric domain model
 * Represents metrics for evaluation runs and results
 */

export interface MetricValue {
  value: number;
  unit?: string;
  timestamp?: Date;
  metadata?: Record<string, unknown>;
}

export interface MetricAggregation {
  count: number;
  sum: number;
  average: number;
  min: number;
  max: number;
  median?: number;
  percentile95?: number;
  percentile99?: number;
}

export interface Metric {
  id: string;
  name: string;
  type: 'accuracy' | 'pass_rate' | 'latency' | 'token_usage' | 'cost' | 'custom';
  values: MetricValue[];
  aggregation?: MetricAggregation;
}

export interface MetricComparison {
  baseline: number;
  current: number;
  delta: number;
  deltaPercent: number;
  improved: boolean;
}
