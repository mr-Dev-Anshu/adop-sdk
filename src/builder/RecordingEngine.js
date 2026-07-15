function defaultMediaRecorderFactory() {
  return navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => ({
    mediaRecorder: new MediaRecorder(stream),
    stream,
  }));
}

class RecordingEngine {
  constructor(selectorGenerator, recordingStatusUI, mediaRecorderFactory = defaultMediaRecorderFactory) {
    this.selectorGenerator = selectorGenerator;
    this.recordingStatusUI = recordingStatusUI;
    this.mediaRecorderFactory = mediaRecorderFactory;

    this.handleClick = this.handleClick.bind(this);

    this.buildSession = null;
    this.apiKey = null;
    this.host = null;
    this.mediaRecorder = null;
    this.mediaStream = null;
    this.audioChunks = [];
    this.steps = [];
    this.recordingStartedAt = null;
    this.listening = false;
  }

  async start(buildSession, apiKey, host) {
    this.buildSession = buildSession;
    this.apiKey = apiKey;
    this.host = host;
    this.steps = [];
    this.audioChunks = [];

    this.recordingStatusUI.create(() => this.stopAndUpload());

    let mediaRecorder;
    let stream;
    try {
      ({ mediaRecorder, stream } = await this.mediaRecorderFactory());
    } catch {
      this.recordingStatusUI.showError('Microphone access is required to record a flow.');
      return;
    }

    this.mediaRecorder = mediaRecorder;
    this.mediaStream = stream;
    this.mediaRecorder.addEventListener('dataavailable', (event) => {
      if (event.data && event.data.size > 0) {
        this.audioChunks.push(event.data);
      }
    });

    this.mediaRecorder.start();
    this.recordingStartedAt = Date.now();

    document.addEventListener('click', this.handleClick, true);
    this.listening = true;
  }

  handleClick(event) {
    const element = event.target;

    if (
      element.closest('[data-rastadikhao-overlay]') ||
      element.closest('[data-rastadikhao-tooltip]') ||
      element.closest('[data-rastadikhao-sidebar]') ||
      element.closest('[data-rastadikhao-status]') ||
      element.closest('[data-rastadikhao-recording-status]')
    ) {
      return;
    }

    const data = this.selectorGenerator.generate(element);
    const clickedAtMs = Date.now() - this.recordingStartedAt;

    this.steps.push({
      ...data,
      route: window.location.pathname,
      clickedAtMs,
    });

    this.recordingStatusUI.updateStepCount(this.steps.length);
  }

  async stop() {
    if (this.listening) {
      document.removeEventListener('click', this.handleClick, true);
      this.listening = false;
    }

    const durationMs = Date.now() - this.recordingStartedAt;

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      await new Promise((resolve) => {
        this.mediaRecorder.addEventListener('stop', resolve, { once: true });
        this.mediaRecorder.stop();
      });
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
    }

    const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
    const audioBlob = new Blob(this.audioChunks, { type: mimeType });

    return { audioBlob, steps: this.steps, durationMs };
  }

  async stopAndUpload() {
    if (this.steps.length === 0) {
      this.recordingStatusUI.showError('Record at least one step before stopping.');
      return;
    }

    this.recordingStatusUI.showProcessing();

    const { audioBlob, steps, durationMs } = await this.stop();

    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');
    formData.append('steps', JSON.stringify(steps));
    formData.append('durationMs', String(durationMs));

    try {
      const response = await fetch(`${this.host}/api/v1/flows/${this.buildSession.buildKey}/recording`, {
        method: 'POST',
        headers: {
          'x-tenant-id': this.apiKey,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const resData = await response.json();
      if (resData.data?.status === 'failed') {
        this.recordingStatusUI.showError(resData.data.error || 'AI processing failed.');
      } else {
        this.recordingStatusUI.showSuccess();
      }
    } catch {
      this.recordingStatusUI.showError('Failed to upload recording. Please check if the backend is running.');
    }
  }
}

export default RecordingEngine;
