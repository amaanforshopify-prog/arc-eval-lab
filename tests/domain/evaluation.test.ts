import { describe, it, expect } from 'vitest';
import type {
  EvaluationCase,
  EvaluationRun,
  EvaluationResult,
  EvaluationSummary,
} from '../../src/domain/evaluation.js';

describe('Evaluation Domain Model', () => {
  describe('EvaluationCase', () => {
    it('should create evaluation case with required fields', () => {
      const case_: EvaluationCase = {
        id: 'case-1',
        datasetId: 'dataset-1',
        datasetItemId: 'item-1',
        input: 'test input',
      };

      expect(case_.id).toBe('case-1');
      expect(case_.datasetId).toBe('dataset-1');
      expect(case_.datasetItemId).toBe('item-1');
      expect(case_.input).toBe('test input');
    });

    it('should create evaluation case with expected output', () => {
      const case_: EvaluationCase = {
        id: 'case-1',
        datasetId: 'dataset-1',
        datasetItemId: 'item-1',
        input: 'test input',
        expectedOutput: 'expected output',
      };

      expect(case_.expectedOutput).toBe('expected output');
    });

    it('should create evaluation case with metadata', () => {
      const case_: EvaluationCase = {
        id: 'case-1',
        datasetId: 'dataset-1',
        datasetItemId: 'item-1',
        input: 'test input',
        metadata: { category: 'test' },
      };

      expect(case_.metadata).toEqual({ category: 'test' });
    });
  });

  describe('EvaluationRun', () => {
    it('should create evaluation run with pending status', () => {
      const run: EvaluationRun = {
        id: 'run-1',
        datasetId: 'dataset-1',
        providerId: 'provider-1',
        evaluatorId: 'evaluator-1',
        status: 'pending',
      };

      expect(run.id).toBe('run-1');
      expect(run.status).toBe('pending');
    });

    it('should create evaluation run with timestamps', () => {
      const startedAt = new Date();
      const completedAt = new Date();
      const run: EvaluationRun = {
        id: 'run-1',
        datasetId: 'dataset-1',
        providerId: 'provider-1',
        evaluatorId: 'evaluator-1',
        status: 'completed',
        startedAt,
        completedAt,
      };

      expect(run.startedAt).toEqual(startedAt);
      expect(run.completedAt).toEqual(completedAt);
    });

    it('should accept all status values', () => {
      const statuses: EvaluationRun['status'][] = [
        'pending',
        'running',
        'completed',
        'failed',
        'cancelled',
      ];

      statuses.forEach((status) => {
        const run: EvaluationRun = {
          id: `run-${status}`,
          datasetId: 'dataset-1',
          providerId: 'provider-1',
          evaluatorId: 'evaluator-1',
          status,
        };
        expect(run.status).toBe(status);
      });
    });
  });

  describe('EvaluationResult', () => {
    it('should create evaluation result with passed status', () => {
      const result: EvaluationResult = {
        id: 'result-1',
        runId: 'run-1',
        caseId: 'case-1',
        actualOutput: 'actual output',
        passed: true,
        evaluatedAt: new Date(),
      };

      expect(result.id).toBe('result-1');
      expect(result.passed).toBe(true);
    });

    it('should create evaluation result with failed status', () => {
      const result: EvaluationResult = {
        id: 'result-1',
        runId: 'run-1',
        caseId: 'case-1',
        actualOutput: 'actual output',
        passed: false,
        error: 'Expected output mismatch',
        evaluatedAt: new Date(),
      };

      expect(result.passed).toBe(false);
      expect(result.error).toBe('Expected output mismatch');
    });

    it('should create evaluation result with score and latency', () => {
      const result: EvaluationResult = {
        id: 'result-1',
        runId: 'run-1',
        caseId: 'case-1',
        actualOutput: 'actual output',
        passed: true,
        score: 0.95,
        latency: 150,
        evaluatedAt: new Date(),
      };

      expect(result.score).toBe(0.95);
      expect(result.latency).toBe(150);
    });
  });

  describe('EvaluationSummary', () => {
    it('should create evaluation summary', () => {
      const summary: EvaluationSummary = {
        runId: 'run-1',
        totalCases: 100,
        passed: 80,
        failed: 15,
        skipped: 5,
        passRate: 0.8,
        averageLatency: 200,
      };

      expect(summary.runId).toBe('run-1');
      expect(summary.totalCases).toBe(100);
      expect(summary.passed).toBe(80);
      expect(summary.failed).toBe(15);
      expect(summary.skipped).toBe(5);
      expect(summary.passRate).toBe(0.8);
      expect(summary.averageLatency).toBe(200);
    });

    it('should create summary without latency', () => {
      const summary: EvaluationSummary = {
        runId: 'run-1',
        totalCases: 10,
        passed: 10,
        failed: 0,
        skipped: 0,
        passRate: 1.0,
      };

      expect(summary.averageLatency).toBeUndefined();
    });
  });
});
