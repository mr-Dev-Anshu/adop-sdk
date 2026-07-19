import { describe, it, expect, beforeEach } from 'vitest';
import detectMode from '../../src/core/ModeDetector.js';

describe('detectMode', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('returns runtime mode when there is no buildKey', () => {
    expect(detectMode()).toEqual({ mode: 'runtime' });
  });

  it('returns builder mode when only buildKey is present', () => {
    window.history.pushState({}, '', '/?buildKey=abc123');
    expect(detectMode()).toEqual({
      mode: 'builder',
      isVerified: true,
      buildSession: { buildKey: 'abc123' },
    });
  });

  it('returns record mode when buildKey and mode=record are present', () => {
    window.history.pushState({}, '', '/?buildKey=abc123&mode=record');
    expect(detectMode()).toEqual({
      mode: 'record',
      isVerified: true,
      buildSession: { buildKey: 'abc123' },
    });
  });
});
