/**
 * Dataset domain model
 * Represents a collection of evaluation cases for AI model testing
 */

export interface DatasetMetadata {
  name: string;
  description?: string;
  version?: string;
  author?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Dataset {
  id: string;
  metadata: DatasetMetadata;
  items: DatasetItem[];
}

export interface DatasetItem {
  id: string;
  input: unknown;
  expectedOutput?: unknown;
  metadata?: Record<string, unknown>;
}

export interface DatasetLoadOptions {
  format?: 'json' | 'jsonl';
  validate?: boolean;
}

export interface DatasetValidationError {
  path: string;
  message: string;
  value?: unknown;
}
