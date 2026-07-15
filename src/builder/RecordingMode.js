import logger from '../utils/logger.js';
import SelectorGenerator from './SelectorGenerator.js';
import RecordingEngine from './RecordingEngine.js';
import RecordingStatusUI from './RecordingStatusUI.js';
import BuildSessionManager from './BuildSessionManager.js';

class RecordingMode {
  constructor(config = {}, historyManager) {
    this.historyManager = historyManager;
    this.config = config;

    this.state = {
      active: false,
      buildSession: null,
    };

    this.selectorGenerator = new SelectorGenerator();
    this.recordingStatusUI = new RecordingStatusUI();
    this.recordingEngine = new RecordingEngine(this.selectorGenerator, this.recordingStatusUI);
  }

  async start(buildSession) {
    if (this.state.active) {
      return;
    }
    this.state.buildSession = buildSession;

    this.buildSessionManager = new BuildSessionManager(buildSession, { mode: 'record' });
    this.historyManager.subscribe(this.buildSessionManager);

    await this.recordingEngine.start(buildSession, this.config.apiKey, this.config.host);

    this.state.active = true;
    logger.debug(this.config.debug, '[RecordingMode] Started');
  }

  destroy() {
    if (!this.state.active) {
      return;
    }

    this.historyManager.unsubscribe(this.buildSessionManager);
    this.buildSessionManager.destroy();
    this.recordingStatusUI.destroy();

    this.state.active = false;
    logger.debug(this.config.debug, '[RecordingMode] Destroyed');
  }
}

export default RecordingMode;
