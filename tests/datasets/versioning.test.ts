import { describe, it, expect } from 'vitest';
import { DatasetVersioning } from '../../src/datasets/versioning.js';
import type { Dataset } from '../../src/domain/dataset.js';

describe('DatasetVersioning', () => {
  const versioning = new DatasetVersioning();

  const createMockDataset = (overrides?: Partial<Dataset>): Dataset => ({
    id: 'test-dataset',
    metadata: {
      name: 'Test Dataset',
      description: 'A test dataset',
      version: '1.0.0',
    },
    items: [
      { id: 'item-1', input: 'test input 1', expectedOutput: 'output 1' },
      { id: 'item-2', input: 'test input 2', expectedOutput: 'output 2' },
    ],
    ...overrides,
  });

  describe('createVersion', () => {
    it('should create a version from dataset', () => {
      const dataset = createMockDataset();
      const version = versioning.createVersion(dataset);

      expect(version).toBeDefined();
      expect(version.id).toMatch(/^v-[a-f0-9]{8}$/);
      expect(version.version).toMatch(/^[a-f0-9]{8}$/);
      expect(version.checksum).toMatch(/^[a-f0-9]+$/);
      expect(version.itemCount).toBe(2);
      expect(version.createdAt).toBeInstanceOf(Date);
      expect(version.metadata.datasetId).toBe('test-dataset');
      expect(version.metadata.datasetName).toBe('Test Dataset');
      expect(version.metadata.datasetVersion).toBe('1.0.0');
    });

    it('should generate consistent versions for identical datasets', () => {
      const dataset = createMockDataset();
      const version1 = versioning.createVersion(dataset);
      const version2 = versioning.createVersion(dataset);

      expect(version1.checksum).toBe(version2.checksum);
      expect(version1.version).toBe(version2.version);
    });

    it('should generate different versions for different datasets', () => {
      const dataset1 = createMockDataset();
      const dataset2 = createMockDataset({
        id: 'different-dataset',
      });

      const version1 = versioning.createVersion(dataset1);
      const version2 = versioning.createVersion(dataset2);

      expect(version1.checksum).not.toBe(version2.checksum);
      expect(version1.version).not.toBe(version2.version);
    });

    it('should generate different versions when items change', () => {
      const dataset1 = createMockDataset();
      const dataset2 = createMockDataset({
        items: [
          { id: 'item-1', input: 'different input', expectedOutput: 'output 1' },
          { id: 'item-2', input: 'test input 2', expectedOutput: 'output 2' },
        ],
      });

      const version1 = versioning.createVersion(dataset1);
      const version2 = versioning.createVersion(dataset2);

      expect(version1.checksum).not.toBe(version2.checksum);
    });

    it('should generate different versions when metadata changes', () => {
      const dataset1 = createMockDataset();
      const dataset2 = createMockDataset({
        metadata: {
          name: 'Different Name',
          version: '1.0.0',
        },
      });

      const version1 = versioning.createVersion(dataset1);
      const version2 = versioning.createVersion(dataset2);

      expect(version1.checksum).not.toBe(version2.checksum);
    });

    it('should handle empty dataset', () => {
      const dataset = createMockDataset({ items: [] });
      const version = versioning.createVersion(dataset);

      expect(version.itemCount).toBe(0);
      expect(version.checksum).toBeDefined();
    });

    it('should handle dataset without version in metadata', () => {
      const dataset = createMockDataset({
        metadata: {
          name: 'Test Dataset',
        },
      });

      const version = versioning.createVersion(dataset);

      expect(version.metadata.datasetVersion).toBeUndefined();
    });
  });

  describe('compareVersions', () => {
    it('should return true for identical versions', () => {
      const dataset = createMockDataset();
      const version1 = versioning.createVersion(dataset);
      const version2 = versioning.createVersion(dataset);

      expect(versioning.compareVersions(version1, version2)).toBe(true);
    });

    it('should return false for different versions', () => {
      const dataset1 = createMockDataset();
      const dataset2 = createMockDataset({ id: 'different' });
      const version1 = versioning.createVersion(dataset1);
      const version2 = versioning.createVersion(dataset2);

      expect(versioning.compareVersions(version1, version2)).toBe(false);
    });
  });

  describe('validateVersion', () => {
    it('should validate matching version', () => {
      const dataset = createMockDataset();
      const expectedVersion = versioning.createVersion(dataset);

      expect(versioning.validateVersion(dataset, expectedVersion)).toBe(true);
    });

    it('should reject mismatched version', () => {
      const dataset1 = createMockDataset();
      const dataset2 = createMockDataset({ id: 'different' });
      const expectedVersion = versioning.createVersion(dataset1);

      expect(versioning.validateVersion(dataset2, expectedVersion)).toBe(false);
    });

    it('should reject version from modified dataset', () => {
      const dataset = createMockDataset();
      const expectedVersion = versioning.createVersion(dataset);

      const modifiedDataset = createMockDataset({
        items: [{ id: 'item-1', input: 'modified', expectedOutput: 'output 1' }],
      });

      expect(versioning.validateVersion(modifiedDataset, expectedVersion)).toBe(false);
    });
  });

  describe('VersioningOptions', () => {
    it('should use sha256 by default', () => {
      const dataset = createMockDataset();
      const versioning = new DatasetVersioning();
      const version = versioning.createVersion(dataset);

      expect(version.checksum).toHaveLength(64); // SHA256 produces 64 hex chars
    });

    it('should support md5 algorithm', () => {
      const dataset = createMockDataset();
      const versioning = new DatasetVersioning({ algorithm: 'md5' });
      const version = versioning.createVersion(dataset);

      expect(version.checksum).toHaveLength(32); // MD5 produces 32 hex chars
    });

    it('should support sha1 algorithm', () => {
      const dataset = createMockDataset();
      const versioning = new DatasetVersioning({ algorithm: 'sha1' });
      const version = versioning.createVersion(dataset);

      expect(version.checksum).toHaveLength(40); // SHA1 produces 40 hex chars
    });

    it('should include metadata by default', () => {
      const dataset1 = createMockDataset({
        metadata: { name: 'Dataset 1', version: '1.0.0' },
      });
      const dataset2 = createMockDataset({
        metadata: { name: 'Dataset 2', version: '1.0.0' },
      });

      const versioning = new DatasetVersioning({ includeMetadata: true });
      const version1 = versioning.createVersion(dataset1);
      const version2 = versioning.createVersion(dataset2);

      expect(version1.checksum).not.toBe(version2.checksum);
    });

    it('should exclude metadata when disabled', () => {
      const dataset1 = createMockDataset({
        metadata: { name: 'Dataset 1', version: '1.0.0' },
      });
      const dataset2 = createMockDataset({
        metadata: { name: 'Dataset 2', version: '1.0.0' },
      });

      const versioning = new DatasetVersioning({ includeMetadata: false });
      const version1 = versioning.createVersion(dataset1);
      const version2 = versioning.createVersion(dataset2);

      expect(version1.checksum).toBe(version2.checksum);
    });
  });
});
