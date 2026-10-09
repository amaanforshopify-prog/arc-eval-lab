/**
 * Dataset versioning
 * Provides deterministic versioning for datasets based on content
 */

import { createHash } from 'crypto';
import type { Dataset } from '../domain/dataset.js';

export interface DatasetVersion {
  id: string;
  version: string;
  checksum: string;
  itemCount: number;
  createdAt: Date;
  metadata: {
    datasetId: string;
    datasetName: string;
    datasetVersion?: string;
  };
}

export interface VersioningOptions {
  algorithm?: 'sha256' | 'md5' | 'sha1';
  includeMetadata?: boolean;
}

export class DatasetVersioning {
  private options: Required<VersioningOptions>;

  constructor(options: VersioningOptions = {}) {
    this.options = {
      algorithm: options.algorithm ?? 'sha256',
      includeMetadata: options.includeMetadata ?? true,
    };
  }

  createVersion(dataset: Dataset): DatasetVersion {
    const checksum = this.calculateChecksum(dataset);
    const version = this.generateVersionId(checksum);

    return {
      id: `v-${version}`,
      version,
      checksum,
      itemCount: dataset.items.length,
      createdAt: new Date(),
      metadata: {
        datasetId: dataset.id,
        datasetName: dataset.metadata.name,
        datasetVersion: dataset.metadata.version,
      },
    };
  }

  compareVersions(version1: DatasetVersion, version2: DatasetVersion): boolean {
    return version1.checksum === version2.checksum;
  }

  private calculateChecksum(dataset: Dataset): string {
    const hash = createHash(this.options.algorithm);

    // Always include dataset ID and items
    hash.update(dataset.id);
    hash.update(JSON.stringify(dataset.items));

    if (this.options.includeMetadata) {
      hash.update(JSON.stringify(dataset.metadata));
    }

    return hash.digest('hex');
  }

  private generateVersionId(checksum: string): string {
    // Use first 8 characters of checksum for version ID
    return checksum.substring(0, 8);
  }

  validateVersion(dataset: Dataset, expectedVersion: DatasetVersion): boolean {
    const currentVersion = this.createVersion(dataset);
    return this.compareVersions(currentVersion, expectedVersion);
  }
}
