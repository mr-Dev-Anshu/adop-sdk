/**
 * Detects whether the SDK should operate in Builder or Runtime mode
 *
 * Builder mode: Full DOM manipulation, overlays, editing capabilities
 * Runtime mode: Passive observation, route tracking only
 *
 * Detection is based on 'buildKey' URL parameter presence
 *
 * @param {Object} options - Configuration options
 * @param {boolean} options.debug - Enable debug logging
 * @param {Function} options.validateBuildKey - Optional validation function
 * @returns {Object} Mode detection result
 *
 * @example
 * // URL: https://example.com?buildKey=abc123
 * detectMode() → { mode: 'builder', isVerified: true, buildSession: { buildKey: 'abc123' } }
 *
 * @example
 * // URL: https://example.com (no buildKey)
 * detectMode() → { mode: 'runtime' }
 */
function detectMode(options = {}) {
  // Extract query parameters from current URL
  // Example: ?buildKey=abc123&user=john → { buildKey: 'abc123', user: 'john' }
  const searchParams = new URLSearchParams(window.location.search);

  // Get the build session identifier
  // This is a unique key that identifies an active build session
  const buildKey = searchParams.get("buildKey");

  // Case 1: No build session → Runtime mode
  // In runtime mode, SDK only observes route changes
  // No builder UI or DOM manipulation
  if (!buildKey) {
    return {
      mode: "runtime",
    };
  }

  // Case 2: Build session found → Try to activate Builder mode
  // TODO: Replace with actual backend validation
  // Current: Temporary verification for development
  // Security Risk: This allows anyone with buildKey to access builder
  const isVerified = true;

  return {
    mode: "builder",
    isVerified,
    buildSession: {
      buildKey, 
    },
  };
}

export default detectMode;
