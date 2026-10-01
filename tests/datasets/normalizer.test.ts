import { describe, it, expect } from 'vitest';
import { DatasetNormalizer } from '../../src/datasets/normalizer.js';
import type { Dataset } from '../../src/domain/dataset.js';

describe('DatasetNormalizer', () => {
  const normalizer = new DatasetNormalizer();

  describe('normalize', () => {
    it('should normalize dataset with default options', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: { name: 'Test Dataset' },
        items: [
          { id: 'item-1', input: '  test input  ' },
          { id: 'item-2', input: '  another input  ' },
        ],
      };

      const normalized = normalizer.normalize(dataset);

      expect(normalized.items[0].input).toBe('test input');
      expect(normalized.items[1].input).toBe('another input');
    });

    it('should generate IDs when requested', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: { name: 'Test Dataset' },
        items: [{ input: 'test' }, { input: 'test 2' }],
      };

      const normalized = normalizer.normalize(dataset, { generateIds: true });

      expect(normalized.items[0].id).toBe('item-0');
      expect(normalized.items[1].id).toBe('item-1');
    });

    it('should not generate IDs when not requested', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: { name: 'Test Dataset' },
        items: [{ input: 'test' }, { input: 'test 2' }],
      };

      const normalized = normalizer.normalize(dataset, { generateIds: false });

      expect(normalized.items[0].id).toBeUndefined();
      expect(normalized.items[1].id).toBeUndefined();
    });

    it('should remove empty items when requested', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: { name: 'Test Dataset' },
        items: [
          { id: 'item-1', input: 'valid' },
          { id: 'item-2', input: '' },
          { id: 'item-3', input: '   ' },
          { id: 'item-4', input: null },
        ],
      };

      const normalized = normalizer.normalize(dataset, { removeEmptyItems: true });

      expect(normalized.items).toHaveLength(1);
      expect(normalized.items[0].id).toBe('item-1');
    });

    it('should not remove empty items when not requested', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: { name: 'Test Dataset' },
        items: [
          { id: 'item-1', input: 'valid' },
          { id: 'item-2', input: '' },
        ],
      };

      const normalized = normalizer.normalize(dataset, { removeEmptyItems: false });

      expect(normalized.items).toHaveLength(2);
    });

    it('should normalize metadata when requested', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: {},
        items: [{ id: 'item-1', input: 'test' }],
      };

      const normalized = normalizer.normalize(dataset, { normalizeMetadata: true });

      expect(normalized.metadata.name).toBe('Unnamed Dataset');
    });

    it('should not normalize metadata when not requested', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: {},
        items: [{ id: 'item-1', input: 'test' }],
      };

      const normalized = normalizer.normalize(dataset, { normalizeMetadata: false });

      expect(normalized.metadata.name).toBeUndefined();
    });

    it('should trim strings in nested objects', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: { name: 'Test Dataset' },
        items: [
          {
            id: 'item-1',
            input: { text: '  test  ', nested: { value: '  value  ' } },
          },
        ],
      };

      const normalized = normalizer.normalize(dataset, { trimStrings: true });

      expect(normalized.items[0].input).toEqual({
        text: 'test',
        nested: { value: 'value' },
      });
    });

    it('should trim strings in arrays', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: { name: 'Test Dataset' },
        items: [
          {
            id: 'item-1',
            input: ['  test  ', '  another  '],
          },
        ],
      };

      const normalized = normalizer.normalize(dataset, { trimStrings: true });

      expect(normalized.items[0].input).toEqual(['test', 'another']);
    });

    it('should trim expected output', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: { name: 'Test Dataset' },
        items: [
          {
            id: 'item-1',
            input: 'test',
            expectedOutput: '  expected  ',
          },
        ],
      };

      const normalized = normalizer.normalize(dataset, { trimStrings: true });

      expect(normalized.items[0].expectedOutput).toBe('expected');
    });

    it('should apply all normalization options', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: {},
        items: [
          { input: '  valid  ' },
          { input: '' },
          { input: '  another  ' },
        ],
      };

      const normalized = normalizer.normalize(dataset, {
        generateIds: true,
        trimStrings: true,
        removeEmptyItems: true,
        normalizeMetadata: true,
      });

      expect(normalized.metadata.name).toBe('Unnamed Dataset');
      expect(normalized.items).toHaveLength(2);
      expect(normalized.items[0].id).toBe('item-0');
      expect(normalized.items[0].input).toBe('valid');
      expect(normalized.items[1].id).toBe('item-1');
      expect(normalized.items[1].input).toBe('another');
    });
  });
});
