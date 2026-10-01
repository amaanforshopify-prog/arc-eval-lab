/**
 * Dataset validation
 * Validates dataset structure and content
 */

import type {
  Dataset,
  DatasetItem,
  DatasetValidationError,
} from '../domain/dataset.js';

export class DatasetValidator {
  validate(dataset: Dataset): DatasetValidationError[] {
    const errors: DatasetValidationError[] = [];

    // Validate dataset structure
    if (!dataset.id || typeof dataset.id !== 'string') {
      errors.push({
        path: 'id',
        message: 'Dataset ID is required and must be a string',
      });
    }

    if (!dataset.metadata || typeof dataset.metadata !== 'object') {
      errors.push({
        path: 'metadata',
        message: 'Dataset metadata is required and must be an object',
      });
    } else {
      if (!dataset.metadata.name || typeof dataset.metadata.name !== 'string') {
        errors.push({
          path: 'metadata.name',
          message: 'Dataset metadata name is required and must be a string',
        });
      }
    }

    if (!Array.isArray(dataset.items)) {
      errors.push({
        path: 'items',
        message: 'Dataset items must be an array',
      });
    } else {
      dataset.items.forEach((item, index) => {
        const itemErrors = this.validateItem(item, index);
        errors.push(...itemErrors);
      });
    }

    // Check for duplicate item IDs
    if (Array.isArray(dataset.items)) {
      const itemIds = dataset.items.map((item) => item.id);
      const duplicates = itemIds.filter(
        (id, index) => itemIds.indexOf(id) !== index,
      );
      if (duplicates.length > 0) {
        errors.push({
          path: 'items',
          message: `Duplicate item IDs found: ${[...new Set(duplicates)].join(', ')}`,
        });
      }
    }

    return errors;
  }

  validateItem(item: DatasetItem, index: number): DatasetValidationError[] {
    const errors: DatasetValidationError[] = [];
    const path = `items[${index}]`;

    if (!item.id || typeof item.id !== 'string') {
      errors.push({
        path: `${path}.id`,
        message: 'Item ID is required and must be a string',
      });
    }

    if (item.input === undefined || item.input === null) {
      errors.push({
        path: `${path}.input`,
        message: 'Item input is required',
      });
    }

    return errors;
  }

  isValid(dataset: Dataset): boolean {
    return this.validate(dataset).length === 0;
  }
}
