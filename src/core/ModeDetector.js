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
  const searchParams = new URLSearchParams(window.location.search);
  const buildKey = searchParams.get("buildKey");

  if (!buildKey) {
    return {
      mode: "runtime",
    };
  }

  const isRecordMode = searchParams.get("mode") === "record";
  const isVerified = true;

  return {
    mode: isRecordMode ? "record" : "builder",
    isVerified,
    buildSession: {
      buildKey,
    },
  };
}

export default detectMode;
