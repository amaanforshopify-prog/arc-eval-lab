import { describe, it, expect } from 'vitest';
import { DatasetLoader } from '../../src/datasets/loader.js';
import type { Dataset } from '../../src/domain/dataset.js';

describe('DatasetLoader', () => {
  const loader = new DatasetLoader();

  describe('loadFromJSON', () => {
    it('should load dataset from JSON string', () => {
      const json = JSON.stringify({
        id: 'dataset-1',
        name: 'Test Dataset',
        description: 'A test dataset',
        items: [
          { id: 'item-1', input: 'input 1', expectedOutput: 'output 1' },
          { id: 'item-2', input: 'input 2' },
        ],
      });

      const dataset = loader.loadFromJSON(json);

      expect(dataset.id).toBe('dataset-1');
      expect(dataset.metadata.name).toBe('Test Dataset');
      expect(dataset.metadata.description).toBe('A test dataset');
      expect(dataset.items).toHaveLength(2);
    });

    it('should handle minimal JSON', () => {
      const json = JSON.stringify({
        items: [{ id: 'item-1', input: 'test' }],
      });

      const dataset = loader.loadFromJSON(json);

      expect(dataset.id).toBe('dataset');
      expect(dataset.metadata.name).toBe('Unnamed Dataset');
      expect(dataset.items).toHaveLength(1);
    });

    it('should throw error for invalid JSON', () => {
      const json = 'invalid json';

      expect(() => loader.loadFromJSON(json)).toThrow('Failed to parse JSON');
    });

    it('should throw error for non-object data', () => {
      const json = JSON.stringify(['array', 'not', 'object']);

      expect(() => loader.loadFromJSON(json)).toThrow('Invalid dataset');
    });

    it('should throw error for non-array items', () => {
      const json = JSON.stringify({
        items: 'not an array',
      });

      expect(() => loader.loadFromJSON(json)).toThrow('Items must be an array');
    });

    it('should throw error for invalid item', () => {
      const json = JSON.stringify({
        items: ['not an object'],
      });

      expect(() => loader.loadFromJSON(json)).toThrow('Item at index 0 must be an object');
    });

    it('should generate IDs for items without IDs', () => {
      const json = JSON.stringify({
        items: [{ input: 'test 1' }, { input: 'test 2' }],
      });

      const dataset = loader.loadFromJSON(json);

      expect(dataset.items[0].id).toBe('item-0');
      expect(dataset.items[1].id).toBe('item-1');
    });
  });

  describe('loadFromJSONL', () => {
    it('should load dataset from JSONL string', () => {
      const jsonl = '{"id": "item-1", "input": "input 1"}\n{"id": "item-2", "input": "input 2"}';

      const dataset = loader.loadFromJSONL(jsonl);

      expect(dataset.id).toBe('jsonl-dataset');
      expect(dataset.metadata.name).toBe('JSONL Dataset');
      expect(dataset.items).toHaveLength(2);
      expect(dataset.items[0].id).toBe('item-1');
      expect(dataset.items[1].id).toBe('item-2');
    });

    it('should handle JSONL without IDs', () => {
      const jsonl = '{"input": "test 1"}\n{"input": "test 2"}';

      const dataset = loader.loadFromJSONL(jsonl);

      expect(dataset.items[0].id).toBe('item-0');
      expect(dataset.items[1].id).toBe('item-1');
    });

    it('should ignore empty lines', () => {
      const jsonl = '{"id": "item-1", "input": "test"}\n\n{"id": "item-2", "input": "test"}';

      const dataset = loader.loadFromJSONL(jsonl);

      expect(dataset.items).toHaveLength(2);
    });

    it('should throw error for invalid JSONL', () => {
      const jsonl = 'invalid json line';

      expect(() => loader.loadFromJSONL(jsonl)).toThrow('Failed to parse JSONL');
    });
  });

  describe('detectFormat', () => {
    it('should detect JSONL format from .jsonl extension', () => {
      const format = loader['detectFormat']('test.jsonl');
      expect(format).toBe('jsonl');
    });

    it('should detect JSON format from .json extension', () => {
      const format = loader['detectFormat']('test.json');
      expect(format).toBe('json');
    });

    it('should default to JSON for unknown extensions', () => {
      const format = loader['detectFormat']('test.txt');
      expect(format).toBe('json');
    });
  });
});
