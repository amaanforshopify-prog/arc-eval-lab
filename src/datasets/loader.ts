/**
 * Dataset loader
 * Loads datasets from JSON and JSONL formats
 */

import { readFile } from 'fs/promises';
import type { Dataset, DatasetLoadOptions } from '../domain/dataset.js';

export class DatasetLoader {
  async loadFromFile(
    filePath: string,
    options: DatasetLoadOptions = {},
  ): Promise<Dataset> {
    const content = await readFile(filePath, 'utf-8');
    const format = options.format || this.detectFormat(filePath);

    if (format === 'jsonl') {
      return this.loadFromJSONL(content);
    }

    return this.loadFromJSON(content);
  }

  loadFromJSON(content: string): Dataset {
    try {
      const data = JSON.parse(content);
      return this.normalizeDataset(data);
    } catch (error) {
      throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  loadFromJSONL(content: string): Dataset {
    try {
      const lines = content.trim().split('\n');
      const items = lines
        .filter((line) => line.trim())
        .map((line, index) => {
          const parsed = JSON.parse(line) as Record<string, unknown>;
          return {
            id: (parsed.id as string) || `item-${index}`,
            input: parsed.input,
            expectedOutput: parsed.expectedOutput,
            metadata: parsed.metadata as Record<string, unknown> | undefined,
          };
        });

      return {
        id: 'jsonl-dataset',
        metadata: {
          name: 'JSONL Dataset',
        },
        items,
      };
    } catch (error) {
      throw new Error(`Failed to parse JSONL: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private detectFormat(filePath: string): 'json' | 'jsonl' {
    if (filePath.endsWith('.jsonl')) {
      return 'jsonl';
    }
    return 'json';
  }

  private normalizeDataset(data: unknown): Dataset {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
      throw new Error('Invalid dataset: data must be an object');
    }

    const obj = data as Record<string, unknown>;

    return {
      id: (obj.id as string) || 'dataset',
      metadata: {
        name: (obj.name as string) || 'Unnamed Dataset',
        description: obj.description as string | undefined,
        version: obj.version as string | undefined,
        author: obj.author as string | undefined,
        tags: obj.tags as string[] | undefined,
        createdAt: obj.createdAt ? new Date(obj.createdAt as string) : undefined,
        updatedAt: obj.updatedAt ? new Date(obj.updatedAt as string) : undefined,
      },
      items: this.normalizeItems(obj.items || []),
    };
  }

  private normalizeItems(items: unknown): Array<{
    id: string;
    input: unknown;
    expectedOutput?: unknown;
    metadata?: Record<string, unknown>;
  }> {
    if (!Array.isArray(items)) {
      throw new Error('Items must be an array');
    }

    return items.map((item, index) => {
      if (!item || typeof item !== 'object') {
        throw new Error(`Item at index ${index} must be an object`);
      }

      const obj = item as Record<string, unknown>;
      return {
        id: (obj.id as string) || `item-${index}`,
        input: obj.input,
        expectedOutput: obj.expectedOutput,
        metadata: obj.metadata as Record<string, unknown> | undefined,
      };
    });
  }
}
