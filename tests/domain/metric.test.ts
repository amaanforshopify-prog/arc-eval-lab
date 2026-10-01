import { describe, it, expect } from 'vitest';
import type {
  MetricValue,
  MetricAggregation,
  Metric,
  MetricComparison,
} from '../../src/domain/metric.js';

describe('Metric Domain Model', () => {
  describe('MetricValue', () => {
    it('should accept minimal value', () => {
      const value: MetricValue = {
        value: 100,
      };

      expect(value.value).toBe(100);
    });

    it('should accept value with unit', () => {
      const value: MetricValue = {
        value: 150,
        unit: 'ms',
      };

      expect(value.unit).toBe('ms');
    });

    it('should accept value with timestamp', () => {
      const timestamp = new Date();
      const value: MetricValue = {
        value: 100,
        timestamp,
      };

      expect(value.timestamp).toEqual(timestamp);
    });

    it('should accept value with metadata', () => {
      const value: MetricValue = {
        value: 100,
        metadata: { source: 'api' },
      };

      expect(value.metadata).toEqual({ source: 'api' });
    });
  });

  describe('MetricAggregation', () => {
    it('should accept basic aggregation', () => {
      const aggregation: MetricAggregation = {
        count: 10,
        sum: 1000,
        average: 100,
        min: 50,
        max: 150,
      };

      expect(aggregation.count).toBe(10);
      expect(aggregation.sum).toBe(1000);
      expect(aggregation.average).toBe(100);
      expect(aggregation.min).toBe(50);
      expect(aggregation.max).toBe(150);
    });

    it('should accept aggregation with percentiles', () => {
      const aggregation: MetricAggregation = {
        count: 100,
        sum: 10000,
        average: 100,
        min: 10,
        max: 200,
        median: 95,
        percentile95: 180,
        percentile99: 195,
      };

      expect(aggregation.median).toBe(95);
      expect(aggregation.percentile95).toBe(180);
      expect(aggregation.percentile99).toBe(195);
    });
  });

  describe('Metric', () => {
    it('should create metric with values', () => {
      const metric: Metric = {
        id: 'metric-1',
        name: 'Latency',
        type: 'latency',
        values: [
          { value: 100 },
          { value: 150 },
          { value: 200 },
        ],
      };

      expect(metric.id).toBe('metric-1');
      expect(metric.name).toBe('Latency');
      expect(metric.type).toBe('latency');
      expect(metric.values).toHaveLength(3);
    });

    it('should accept all metric types', () => {
      const types: Metric['type'][] = ['accuracy', 'pass_rate', 'latency', 'token_usage', 'cost', 'custom'];

      types.forEach((type) => {
        const metric: Metric = {
          id: `metric-${type}`,
          name: type,
          type,
          values: [{ value: 100 }],
        };
        expect(metric.type).toBe(type);
      });
    });

    it('should create metric with aggregation', () => {
      const metric: Metric = {
        id: 'metric-1',
        name: 'Latency',
        type: 'latency',
        values: [{ value: 100 }],
        aggregation: {
          count: 1,
          sum: 100,
          average: 100,
          min: 100,
          max: 100,
        },
      };

      expect(metric.aggregation).toBeDefined();
      expect(metric.aggregation?.average).toBe(100);
    });
  });

  describe('MetricComparison', () => {
    it('should create comparison with improvement', () => {
      const comparison: MetricComparison = {
        baseline: 200,
        current: 150,
        delta: -50,
        deltaPercent: -25,
        improved: true,
      };

      expect(comparison.baseline).toBe(200);
      expect(comparison.current).toBe(150);
      expect(comparison.delta).toBe(-50);
      expect(comparison.deltaPercent).toBe(-25);
      expect(comparison.improved).toBe(true);
    });

    it('should create comparison with regression', () => {
      const comparison: MetricComparison = {
        baseline: 150,
        current: 200,
        delta: 50,
        deltaPercent: 33.33,
        improved: false,
      };

      expect(comparison.improved).toBe(false);
      expect(comparison.delta).toBeGreaterThan(0);
    });
  });
});
