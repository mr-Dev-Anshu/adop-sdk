import logger from "../utils/logger.js";
import { DEFAULT_CONFIG } from "./config.js";
import { SDK_STATES } from "./constants.js";
import { validateConfig } from "./validator.js";
import detectMode from "./ModeDetector.js";
import HistoryManager from "./HistoryManager.js";
import BuilderMode from "../builder/BuilderMode.js";
import RouteObserver from "../observer/RouteObserver.js";

/**
 * Core SDK class managing all subsystems
 * Orchestrates history, routing, and builder functionality
 * Lifecycle: IDLE → INITIALIZING → READY → DESTROYED
 */
class SDK {
  /**
   * Creates a new SDK instance
   * @param {Object} config - User configuration
   * @throws {Error} If config validation fails
   */
  constructor(config = {}) {
    // Validate and merge configurations
    validateConfig(config);
    this.config = { ...DEFAULT_CONFIG, ...config };

    // Initialize subsystems
    this.historyManager = new HistoryManager();
    this.builderMode = new BuilderMode(this.config, this.historyManager);
    this.routeObserver = new RouteObserver((route) => {
      logger.debug(this.config.debug, "[SDK] Route Changed", route);
    });

    this.state = SDK_STATES.IDLE;
  }

  /**
   * Initializes all SDK subsystems
   * @throws {Error} If any subsystem fails to initialize
   */
  init() {
    try {
      this.state = SDK_STATES.INITIALIZING;
      logger.debug(this.config.debug, "[SDK] INITIALIZING");

      // Start core infrastructure
      this.historyManager.start();
      this.historyManager.subscribe(this.routeObserver);

      // Detect and start builder mode if applicable
      const mode = detectMode();
      if (mode.mode === "builder" && mode.isVerified) {
        this.builderMode.start(mode.buildSession);
      }

      this.state = SDK_STATES.READY;
      logger.debug(this.config.debug, "[SDK] READY");
    } catch (error) {
      this.state = SDK_STATES.ERROR;
      logger.error(this.config.debug, "[SDK] Initialization failed", error);
      throw new Error(`[SDK] Init failed: ${error.message}`);
    }
  }

  /**
   * Cleanly destroys all SDK subsystems
   * Restores browser APIs and removes all listeners
   * @throws {Error} If cleanup fails
   */
  destroy() {
    try {
      // Shutdown subsystems in reverse order
      this.builderMode.destroy();
      this.historyManager.unsubscribe(this.routeObserver);
      this.historyManager.stop();

      this.state = SDK_STATES.DESTROYED;
      logger.debug(this.config.debug, "[SDK] DESTROYED");
    } catch (error) {
      this.state = SDK_STATES.ERROR;
      logger.error(this.config.debug, "[SDK] Destruction failed", error);
      throw new Error(`[SDK] Destroy failed: ${error.message}`);
    }
  }
}

export default SDK;
