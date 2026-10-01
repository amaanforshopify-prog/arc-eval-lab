import { describe, it, expect } from 'vitest';
import { DatasetValidator } from '../../src/datasets/validator.js';
import type { Dataset } from '../../src/domain/dataset.js';

describe('DatasetValidator', () => {
  const validator = new DatasetValidator();

  describe('validate', () => {
    it('should validate a valid dataset', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: {
          name: 'Test Dataset',
        },
        items: [
          {
            id: 'item-1',
            input: 'test input',
          },
        ],
      };

      const errors = validator.validate(dataset);
      expect(errors).toHaveLength(0);
    });

    it('should return error for missing dataset ID', () => {
      const dataset = {
        metadata: { name: 'Test Dataset' },
        items: [],
      } as unknown as Dataset;

      const errors = validator.validate(dataset);
      expect(errors).toHaveLength(1);
      expect(errors[0].path).toBe('id');
      expect(errors[0].message).toContain('ID is required');
    });

    it('should return error for missing metadata', () => {
      const dataset = {
        id: 'dataset-1',
        items: [],
      } as unknown as Dataset;

      const errors = validator.validate(dataset);
      expect(errors).toHaveLength(1);
      expect(errors[0].path).toBe('metadata');
    });

    it('should return error for missing metadata name', () => {
      const dataset = {
        id: 'dataset-1',
        metadata: {},
        items: [],
      } as unknown as Dataset;

      const errors = validator.validate(dataset);
      expect(errors).toHaveLength(1);
      expect(errors[0].path).toBe('metadata.name');
    });

    it('should return error for non-array items', () => {
      const dataset = {
        id: 'dataset-1',
        metadata: { name: 'Test Dataset' },
        items: 'not an array',
      } as unknown as Dataset;

      const errors = validator.validate(dataset);
      expect(errors).toHaveLength(1);
      expect(errors[0].path).toBe('items');
    });

    it('should return error for item with missing ID', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: { name: 'Test Dataset' },
        items: [{ input: 'test' }] as unknown as DatasetItem[],
      };

      const errors = validator.validate(dataset);
      expect(errors.some((e) => e.path === 'items[0].id')).toBe(true);
    });

    it('should return error for item with missing input', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: { name: 'Test Dataset' },
        items: [{ id: 'item-1' }] as unknown as DatasetItem[],
      };

      const errors = validator.validate(dataset);
      expect(errors.some((e) => e.path === 'items[0].input')).toBe(true);
    });

    it('should return error for duplicate item IDs', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: { name: 'Test Dataset' },
        items: [
          { id: 'item-1', input: 'input 1' },
          { id: 'item-1', input: 'input 2' },
        ],
      };

      const errors = validator.validate(dataset);
      expect(errors.some((e) => e.path === 'items' && e.message?.includes('Duplicate'))).toBe(
        true,
      );
    });

    it('should return multiple errors for invalid dataset', () => {
      const dataset = {
        metadata: {},
        items: [{ input: 'test' }] as unknown as DatasetItem[],
      } as unknown as Dataset;

      const errors = validator.validate(dataset);
      expect(errors.length).toBeGreaterThan(1);
    });
  });

  describe('isValid', () => {
    it('should return true for valid dataset', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: { name: 'Test Dataset' },
        items: [{ id: 'item-1', input: 'test' }],
      };

      expect(validator.isValid(dataset)).toBe(true);
    });

    it('should return false for invalid dataset', () => {
      const dataset = {
        metadata: {},
        items: [],
      } as unknown as Dataset;

      expect(validator.isValid(dataset)).toBe(false);
    });
  });
});
