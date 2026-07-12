import SDK from "./core/SDK.js";
import logger from "./utils/logger.js";

/**
 * RastaDikhao - Main entry point for the SDK
 * Implements Singleton pattern to ensure only one SDK instance exists
 * Provides lifecycle management (init, get, destroy)
 */
class RastaDikhao {
  /**
   * Tracks whether SDK has been initialized
   * Prevents multiple initialization attempts
   */
  static _initialized = false;
  /**
   * Holds the single SDK instance
   * Used by getInstance() to return the active instance
   */
  static _instance = null;

  /**
   * Initializes the SDK with given configuration
   * Creates and returns the singleton instance
   *
   * @param {Object} config - SDK configuration options
   * @returns {SDK} The initialized SDK instance
   * @throws {Error} If config is invalid
   */

  static init(config = {}) {
    // if already initialized the SDK
    if (this.initialized) {
      logger.warn("[RastaDikhao] SDK already initialized.");
      return this.instance;
    }

    // Create the core SDK instance.
    const sdk = new SDK(config);
    // Bootstrap SDK lifecycle.
    sdk.init();

    // now initialize is true to user dubara init nahi kr sakta
    this.instance = sdk;
    this.initialized = true;

    logger.warn("[RastaDikhao] SDK initialized");

    return sdk;
  }

  // for geting instance (RastaDikho.getInstance())
  static getInstance() {
    return this.instance;
  }

  static identify(endUserId, traits = {}) {
    if (this.instance) {
      this.instance.identify(endUserId, traits);
    } else {
      logger.warn("[RastaDikhao] Cannot identify user: SDK not initialized.");
    }
  }

  static logout() {
    if (this.instance) {
      this.instance.logout();
    }
  }

  // Gracefully shutdown the SDK and release resources.
  static destroy() {
    if (!this.initialized) {
      return;
    }
    this.instance.destroy();
    this.instance = null;
    this.initialized = false;
  }
}

// Expose SDK globally when loaded through a browser <script> tag.
if (typeof window !== "undefined") {
  window.RastaDikhao = RastaDikhao;
} else if (typeof global !== "undefined") {
  global.RastaDikhao = RastaDikhao; // Node.js support
}

// Object.freeze(RastaDikhao);

export default RastaDikhao;
