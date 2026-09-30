import { describe, it, expect } from 'vitest';
import type { Dataset, DatasetItem, DatasetMetadata } from '../../src/domain/dataset.js';

describe('Dataset Domain Model', () => {
  describe('DatasetMetadata', () => {
    it('should accept minimal metadata', () => {
      const metadata: DatasetMetadata = {
        name: 'test-dataset',
      };

      expect(metadata.name).toBe('test-dataset');
    });

    it('should accept full metadata', () => {
      const metadata: DatasetMetadata = {
        name: 'test-dataset',
        description: 'A test dataset',
        version: '1.0.0',
        author: 'test-author',
        tags: ['test', 'evaluation'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(metadata.name).toBe('test-dataset');
      expect(metadata.description).toBe('A test dataset');
      expect(metadata.version).toBe('1.0.0');
      expect(metadata.author).toBe('test-author');
      expect(metadata.tags).toEqual(['test', 'evaluation']);
      expect(metadata.createdAt).toBeDefined();
      expect(metadata.updatedAt).toBeDefined();
    });
  });

  describe('DatasetItem', () => {
    it('should accept minimal item', () => {
      const item: DatasetItem = {
        id: 'item-1',
        input: 'test input',
      };

      expect(item.id).toBe('item-1');
      expect(item.input).toBe('test input');
    });

    it('should accept item with expected output', () => {
      const item: DatasetItem = {
        id: 'item-1',
        input: 'test input',
        expectedOutput: 'expected output',
      };

      expect(item.expectedOutput).toBe('expected output');
    });

    it('should accept item with metadata', () => {
      const item: DatasetItem = {
        id: 'item-1',
        input: 'test input',
        metadata: { category: 'test', difficulty: 'easy' },
      };

      expect(item.metadata).toEqual({ category: 'test', difficulty: 'easy' });
    });
  });

  describe('Dataset', () => {
    it('should create dataset with items', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: {
          name: 'test-dataset',
        },
        items: [
          {
            id: 'item-1',
            input: 'input 1',
          },
          {
            id: 'item-2',
            input: 'input 2',
          },
        ],
      };

      expect(dataset.id).toBe('dataset-1');
      expect(dataset.metadata.name).toBe('test-dataset');
      expect(dataset.items).toHaveLength(2);
    });

    it('should create empty dataset', () => {
      const dataset: Dataset = {
        id: 'dataset-1',
        metadata: {
          name: 'empty-dataset',
        },
        items: [],
      };

      expect(dataset.items).toHaveLength(0);
    });
  });
});
