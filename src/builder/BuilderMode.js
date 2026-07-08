import logger from "../utils/logger.js";
import OverlayRenderer from "./OverlayRenderer.js";
import AttributeTooltip from "./AttributeTooltip.js";
import SelectorGenerator from "./SelectorGenerator.js";
import InspectorEngine from "./InspectorEngine.js";
import BuildSessionManager from "./BuildSessionManager.js";
import BuilderStatusUI from "./BuilderStatusUI.js";
import SidebarRenderer from "./SidebarRenderer.js";

// for starting the builder mode
class BuilderMode {
  constructor(config = {}, historyManager) {
    this.historyManager = historyManager;
    this.config = config;

    this.state = {
      active: false,
      paused: false,
      selectedElement: null,
      selectedSelector: null,
      buildSession: null,
    };

    this.overlayRenderer = new OverlayRenderer();
    this.attributeTooltip = new AttributeTooltip();
    this.selectorGenerator = new SelectorGenerator();
    this.sidebarRenderer = new SidebarRenderer();

    this.builderStatusUI = new BuilderStatusUI();

    this.inspectorEngine = new InspectorEngine(
      this.overlayRenderer,
      this.selectorGenerator,
      this.attributeTooltip,
      this.sidebarRenderer,
    );

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  start(buildSession) {
    if (this.state.active) {
      return;
    }
    this.state.buildSession = buildSession;

    this.buildSessionManager = new BuildSessionManager(buildSession);

    this.historyManager.subscribe(this.buildSessionManager);

    this.overlayRenderer.create();

    this.attributeTooltip.create();

    this.builderStatusUI.create();
    
    this.sidebarRenderer.create();

    this.inspectorEngine.start(buildSession, this.config.apiKey);

    window.addEventListener("keydown", this.handleKeyDown);

    this.state.active = true;

    logger.debug(this.config.debug, "[BuilderMode] Started");
  }

  pause() {
    if (this.state.paused) {
      return;
    }
    this.inspectorEngine.stop();
    this.overlayRenderer.hide();
    this.attributeTooltip.hide();
    this.sidebarRenderer.hide();
    this.builderStatusUI.show();
    this.state.paused = true;
    logger.debug(this.config.debug, "[BuilderMode] Paused");
  }

  resume() {
    if (!this.state.paused) {
      return;
    }
    this.inspectorEngine.start(this.state.buildSession, this.config.apiKey);
    this.state.paused = false;
    this.builderStatusUI.hide();
    logger.debug(this.config.debug, "[BuilderMode] Resumed");
  }

  toggle() {
    if (this.state.paused) {
      this.resume();
    } else {
      this.pause();
    }
  }

  handleKeyDown(event) {
    if (event.altKey && event.key.toLowerCase() === "b") {
      event.preventDefault();

      this.toggle();
    }
  }

  destroy() {
    if (!this.state.active) {
      return;
    }

    this.historyManager.unsubscribe(this.buildSessionManager);

    this.buildSessionManager.destroy();
    this.inspectorEngine.stop();

    this.attributeTooltip.destroy();
    this.sidebarRenderer.destroy();

    this.overlayRenderer.destroy();
    this.builderStatusUI.destroy();

    window.removeEventListener("keydown", this.handleKeyDown);

    this.state.active = false;

    logger.debug(this.config.debug, "[BuilderMode] Destroyed");
  }
}

export default BuilderMode;
