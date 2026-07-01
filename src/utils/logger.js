export const logger = {
  debug(enabled, ...args) {
    if (!enabled) return;

    console.log(...args);
  },

  warn(...args) {
    console.warn(...args);
  },

  error(...args) {
    console.error(...args);
  },
};

export default logger;
