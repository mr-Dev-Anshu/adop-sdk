export function validateConfig(config) {
  // config should be a plain object
  if (typeof config !== "object" || config === null || Array.isArray(config)) {
    throw new Error("[RastaDikhao] Config must be an object.");
  }

  // apiKey validation
  if (typeof config.apiKey !== "string") {
    throw new Error("[RastaDikhao] apiKey must be a string.");
  }

  // environment validation
  const allowedEnvironments = ["development", "production"];

  if (
    config.environment !== undefined &&
    !allowedEnvironments.includes(config.environment)
  ) {
    throw new Error("[RastaDikhao] Invalid environment.");
  }

  // debug validation
  if (config.debug !== undefined && typeof config.debug !== "boolean") {
    throw new Error("[RastaDikhao] debug must be boolean.");
  }
}
