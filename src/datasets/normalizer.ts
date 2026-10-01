/**
 * Dataset normalizer
 * Normalizes datasets to a consistent format
 */

import type { Dataset, DatasetItem } from '../domain/dataset.js';

export interface NormalizationOptions {
  generateIds?: boolean;
  trimStrings?: boolean;
  removeEmptyItems?: boolean;
  normalizeMetadata?: boolean;
}

export class DatasetNormalizer {
  normalize(dataset: Dataset, options: NormalizationOptions = {}): Dataset {
    const opts: Required<NormalizationOptions> = {
      generateIds: options.generateIds ?? false,
      trimStrings: options.trimStrings ?? true,
      removeEmptyItems: options.removeEmptyItems ?? false,
      normalizeMetadata: options.normalizeMetadata ?? true,
    };

    let items = dataset.items;

    // Remove empty items if requested
    if (opts.removeEmptyItems) {
      items = items.filter((item) => this.isItemValid(item));
    }

    // Generate IDs if requested
    if (opts.generateIds) {
      items = items.map((item, index) => ({
        ...item,
        id: item.id || `item-${index}`,
      }));
    }

    // Trim strings if requested
    if (opts.trimStrings) {
      items = items.map((item) => this.trimItemStrings(item));
    }

    // Normalize metadata if requested
    let metadata = dataset.metadata;
    if (opts.normalizeMetadata) {
      metadata = this.normalizeMetadata(metadata);
    }

    return {
      ...dataset,
      metadata,
      items,
    };
  }

  private isItemValid(item: DatasetItem): boolean {
    return (
      item.input !== undefined &&
      item.input !== null &&
      item.input !== '' &&
      (typeof item.input !== 'string' || item.input.trim().length > 0)
    );
  }

  private trimItemStrings(item: DatasetItem): DatasetItem {
    const trimValue = (value: unknown): unknown => {
      if (typeof value === 'string') {
        return value.trim();
      }
      if (Array.isArray(value)) {
        return value.map(trimValue);
      }
      if (value && typeof value === 'object') {
        const trimmed: Record<string, unknown> = {};
        for (const [key, val] of Object.entries(value)) {
          trimmed[key] = trimValue(val);
        }
        return trimmed;
      }
      return value;
    };

    return {
      ...item,
      input: trimValue(item.input),
      expectedOutput: item.expectedOutput !== undefined ? trimValue(item.expectedOutput) : undefined,
      metadata: item.metadata ? (trimValue(item.metadata) as Record<string, unknown>) : undefined,
    };
  }

  private normalizeMetadata(metadata: Dataset['metadata']): Dataset['metadata'] {
    if (!metadata) {
      return { name: 'Unnamed Dataset' };
    }

    return {
      name: metadata.name || 'Unnamed Dataset',
      description: metadata.description,
      version: metadata.version,
      author: metadata.author,
      tags: metadata.tags,
      createdAt: metadata.createdAt,
      updatedAt: metadata.updatedAt,
    };
  }
}
