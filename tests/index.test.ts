import { describe, it, expect } from 'vitest';
import { greet, version } from '../src/index.js';

describe('ARC EvalLab', () => {
  it('should have a version', () => {
    expect(version).toBe('0.0.1');
  });

  it('should greet users', () => {
    expect(greet('World')).toBe('Hello, World! Welcome to ARC EvalLab.');
  });
});
