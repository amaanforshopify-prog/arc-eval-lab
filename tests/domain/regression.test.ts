import { describe, it, expect } from 'vitest';
import type {
  BaselineRun,
  RegressionThreshold,
  RegressionReport,
  RegressionIssue,
} from '../../src/domain/regression.js';

describe('Regression Domain Model', () => {
  describe('BaselineRun', () => {
    it('should create baseline run', () => {
      const baseline: BaselineRun = {
        runId: 'run-1',
        metrics: { accuracy: 0.95, latency: 100 },
        timestamp: new Date(),
      };

      expect(baseline.runId).toBe('run-1');
      expect(baseline.metrics.accuracy).toBe(0.95);
      expect(baseline.metrics.latency).toBe(100);
    });

    it('should create baseline with single metric', () => {
      const baseline: BaselineRun = {
        runId: 'run-1',
        metrics: { pass_rate: 0.8 },
        timestamp: new Date(),
      };

      expect(Object.keys(baseline.metrics)).toHaveLength(1);
    });
  });

  describe('RegressionThreshold', () => {
    it('should create threshold with increase direction', () => {
      const threshold: RegressionThreshold = {
        metric: 'latency',
        threshold: 0.1,
        direction: 'increase',
      };

      expect(threshold.metric).toBe('latency');
      expect(threshold.threshold).toBe(0.1);
      expect(threshold.direction).toBe('increase');
    });

    it('should create threshold with decrease direction', () => {
      const threshold: RegressionThreshold = {
        metric: 'accuracy',
        threshold: 0.05,
        direction: 'decrease',
      };

      expect(threshold.direction).toBe('decrease');
    });
  });

  describe('RegressionReport', () => {
    it('should create regression report', () => {
      const report: RegressionReport = {
        id: 'report-1',
        baselineRunId: 'run-1',
        currentRunId: 'run-2',
        regressions: [],
        improvements: [],
        stable: ['accuracy'],
        generatedAt: new Date(),
      };

      expect(report.id).toBe('report-1');
      expect(report.baselineRunId).toBe('run-1');
      expect(report.currentRunId).toBe('run-2');
      expect(report.regressions).toHaveLength(0);
      expect(report.improvements).toHaveLength(0);
      expect(report.stable).toEqual(['accuracy']);
    });

    it('should create report with regressions', () => {
      const report: RegressionReport = {
        id: 'report-1',
        baselineRunId: 'run-1',
        currentRunId: 'run-2',
        regressions: [
          {
            metric: 'accuracy',
            baselineValue: 0.95,
            currentValue: 0.85,
            delta: -0.1,
            deltaPercent: -10.53,
            severity: 'high',
          },
        ],
        improvements: [],
        stable: [],
        generatedAt: new Date(),
      };

      expect(report.regressions).toHaveLength(1);
      expect(report.regressions[0].severity).toBe('high');
    });

    it('should create report with improvements', () => {
      const report: RegressionReport = {
        id: 'report-1',
        baselineRunId: 'run-1',
        currentRunId: 'run-2',
        regressions: [],
        improvements: [
          {
            metric: 'latency',
            baselineValue: 200,
            currentValue: 150,
            delta: -50,
            deltaPercent: -25,
            severity: 'low',
          },
        ],
        stable: [],
        generatedAt: new Date(),
      };

      expect(report.improvements).toHaveLength(1);
      expect(report.improvements[0].metric).toBe('latency');
    });
  });

  describe('RegressionIssue', () => {
    it('should create regression issue', () => {
      const issue: RegressionIssue = {
        metric: 'accuracy',
        baselineValue: 0.95,
        currentValue: 0.85,
        delta: -0.1,
        deltaPercent: -10.53,
        severity: 'high',
      };

      expect(issue.metric).toBe('accuracy');
      expect(issue.baselineValue).toBe(0.95);
      expect(issue.currentValue).toBe(0.85);
      expect(issue.delta).toBe(-0.1);
      expect(issue.deltaPercent).toBe(-10.53);
      expect(issue.severity).toBe('high');
    });

    it('should accept all severity levels', () => {
      const severities: RegressionIssue['severity'][] = ['low', 'medium', 'high', 'critical'];

      severities.forEach((severity) => {
        const issue: RegressionIssue = {
          metric: 'accuracy',
          baselineValue: 0.95,
          currentValue: 0.85,
          delta: -0.1,
          deltaPercent: -10.53,
          severity,
        };
        expect(issue.severity).toBe(severity);
      });
    });

    it('should create issue with threshold', () => {
      const issue: RegressionIssue = {
        metric: 'accuracy',
        baselineValue: 0.95,
        currentValue: 0.85,
        delta: -0.1,
        deltaPercent: -10.53,
        severity: 'high',
        threshold: 0.05,
      };

      expect(issue.threshold).toBe(0.05);
    });
  });
});
