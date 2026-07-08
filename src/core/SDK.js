import logger from "../utils/logger.js";
import { DEFAULT_CONFIG } from "./config.js";
import { SDK_STATES } from "./constants.js";
import { validateConfig } from "./validator.js";
import detectMode from "./ModeDetector.js";
import HistoryManager from "./HistoryManager.js";
import BuilderMode from "../builder/BuilderMode.js";
import RouteObserver from "../observer/RouteObserver.js";
import TourPlayer from "../runtime/TourPlayer.js";

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

    this.flows = [];
    this.tourPlayer = new TourPlayer();

    // Initialize subsystems
    this.historyManager = new HistoryManager();
    this.builderMode = new BuilderMode(this.config, this.historyManager);
    this.routeObserver = new RouteObserver((route) => {
      logger.debug(this.config.debug, "[SDK] Route Changed", route);
      if (this.tourPlayer) {
        if (this.tourPlayer.active) {
          this.tourPlayer.handleRouteChange(route.pathname);
        } else {
          this.triggerMatchingFlow();
        }
      }
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
        this.verifyBuildSession(mode.buildSession);
      } else if (mode.mode === "runtime") {
        this.fetchAndRegisterFlows();
      }

      this.state = SDK_STATES.READY;
      logger.debug(this.config.debug, "[SDK] READY");
    } catch (error) {
      this.state = SDK_STATES.ERROR;
      logger.error(this.config.debug, "[SDK] Initialization failed", error);
      throw new Error(`[SDK] Init failed: ${error.message}`);
    }
  }

  async verifyBuildSession(buildSession) {
    const buildKey = buildSession.buildKey;
    logger.debug(this.config.debug, `[SDK] Verifying buildKey: ${buildKey}`);

    try {
      const response = await fetch(`http://localhost:3000/api/v1/flows/${buildKey}`, {
        method: "GET",
        headers: {
          "x-tenant-id": this.config.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Invalid buildKey (Status: ${response.status})`);
      }

      const resData = await response.json();
      logger.warn(`[RastaDikhao] buildKey verified successfully. Flow found: "${resData.data.name}"`);

      // Start builder mode only after verification succeeds
      this.builderMode.start(buildSession);
    } catch (error) {
      logger.warn(`[RastaDikhao] Verification failed for buildKey "${buildKey}". Builder mode disabled.`);
      this.builderMode.destroy();
    }
  }

  async fetchAndRegisterFlows() {
    logger.debug(this.config.debug, "[SDK] Fetching flows in runtime mode...");

    try {
      const response = await fetch("http://localhost:3000/api/v1/flows", {
        method: "GET",
        headers: {
          "x-tenant-id": this.config.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch flows (Status: ${response.status})`);
      }

      const resData = await response.json();
      this.flows = resData.data || [];
      logger.debug(this.config.debug, `[SDK] Fetched ${this.flows.length} flows successfully.`);

      this.triggerMatchingFlow();
    } catch (error) {
      logger.error(this.config.debug, "[SDK] Failed to fetch flows for onboarding:", error);
    }
  }

  triggerMatchingFlow() {
    if (this.tourPlayer && this.tourPlayer.active) return;

    const currentPathname = window.location.pathname;
    const matchingFlow = this.flows.find(flow => {
      return flow.steps && flow.steps.length > 0 && flow.steps[0].route === currentPathname;
    });

    if (matchingFlow) {
      logger.warn(`[RastaDikhao] Starting tour: "${matchingFlow.name}"`);
      this.tourPlayer.start(matchingFlow);
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
      if (this.tourPlayer) {
        this.tourPlayer.cleanup();
      }
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
