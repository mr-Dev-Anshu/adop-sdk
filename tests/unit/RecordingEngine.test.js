import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import RecordingEngine from '../../src/builder/RecordingEngine.js';

function makeFakeMediaRecorder() {
  const listeners = {};
  return {
    state: 'recording',
    mimeType: 'audio/webm',
    addEventListener: (event, cb) => {
      listeners[event] = cb;
    },
    start: vi.fn(),
    stop: vi.fn(function () {
      this.state = 'inactive';
      listeners.stop && listeners.stop();
    }),
  };
}

function makeFakeStream() {
  return { getTracks: () => [{ stop: vi.fn() }] };
}

describe('RecordingEngine', () => {
  let selectorGenerator;
  let recordingStatusUI;
  let fakeMediaRecorder;
  let mediaRecorderFactory;
  let engine;

  beforeEach(() => {
    document.body.innerHTML = `
      <div data-rastadikhao-overlay="true"><button id="ignored">Ignored</button></div>
      <button id="target-a">A</button>
      <button id="target-b">B</button>
    `;
    selectorGenerator = { generate: (el) => ({ tagName: el.tagName, selector: `#${el.id}` }) };
    recordingStatusUI = {
      create: vi.fn(),
      updateStepCount: vi.fn(),
      showProcessing: vi.fn(),
      showSuccess: vi.fn(),
      showError: vi.fn(),
    };
    fakeMediaRecorder = makeFakeMediaRecorder();
    mediaRecorderFactory = vi.fn(async () => ({ mediaRecorder: fakeMediaRecorder, stream: makeFakeStream() }));
    engine = new RecordingEngine(selectorGenerator, recordingStatusUI, mediaRecorderFactory);
    global.fetch = vi.fn(async () => ({ ok: true, json: async () => ({ data: { status: 'ready' } }) }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('captures a step for each tracked click and ignores clicks inside overlay elements', async () => {
    await engine.start({ buildKey: 'flow-1' }, 'api-key', 'http://localhost:3000');

    document.getElementById('ignored').click();
    document.getElementById('target-a').click();
    document.getElementById('target-b').click();

    expect(engine.steps).toHaveLength(2);
    expect(engine.steps[0].selector).toBe('#target-a');
    expect(engine.steps[1].selector).toBe('#target-b');
    expect(recordingStatusUI.updateStepCount).toHaveBeenLastCalledWith(2);
  });

  it('stop() returns the captured steps and an audio blob', async () => {
    await engine.start({ buildKey: 'flow-1' }, 'api-key', 'http://localhost:3000');
    document.getElementById('target-a').click();

    const result = await engine.stop();

    expect(result.steps).toHaveLength(1);
    expect(result.audioBlob).toBeInstanceOf(Blob);
    expect(fakeMediaRecorder.stop).toHaveBeenCalled();
  });

  it('stopAndUpload refuses to upload when zero steps were captured', async () => {
    await engine.start({ buildKey: 'flow-1' }, 'api-key', 'http://localhost:3000');

    await engine.stopAndUpload();

    expect(recordingStatusUI.showError).toHaveBeenCalledWith(
      'Record at least one step before stopping.'
    );
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('start() shows an error and does not attach listeners when mic permission is denied', async () => {
    mediaRecorderFactory.mockRejectedValueOnce(new Error('Permission denied'));

    await engine.start({ buildKey: 'flow-1' }, 'api-key', 'http://localhost:3000');
    document.getElementById('target-a').click();

    expect(recordingStatusUI.showError).toHaveBeenCalledWith(
      'Microphone access is required to record a flow.'
    );
    expect(engine.steps).toHaveLength(0);
  });
});
