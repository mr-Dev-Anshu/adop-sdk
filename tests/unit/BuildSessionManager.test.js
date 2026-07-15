import { describe, it, expect } from 'vitest';
import BuildSessionManager from '../../src/builder/BuildSessionManager.js';

describe('BuildSessionManager', () => {
  it('preserves only buildKey when no extraParams are given', () => {
    const manager = new BuildSessionManager({ buildKey: 'abc123' });
    expect(manager.preserveBuildKey('/product?foo=bar')).toBe('/product?foo=bar&buildKey=abc123');
  });

  it('preserves extraParams alongside buildKey', () => {
    const manager = new BuildSessionManager({ buildKey: 'abc123' }, { mode: 'record' });
    expect(manager.preserveBuildKey('/product')).toBe('/product?buildKey=abc123&mode=record');
  });
});
