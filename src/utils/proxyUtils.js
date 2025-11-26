// src/utils/proxyUtils.js
import { PROXY_LIST, PROXY_TARGET_DOMAIN } from "../config/proxyConfig.js";

/**
 * Parses a proxy string into axios proxy configuration
 * @param {string} proxyString - Format: "ip:port:username:password"
 * @returns {Object} Axios proxy configuration object
 */
export function createProxyConfig(proxyString) {
  const [host, port, username, password] = proxyString.split(":");
  
  return {
    host,
    port: parseInt(port, 10),
    auth: {
      username,
      password
    },
    protocol: "http"
  };
}

/**
 * Gets a random proxy from the proxy list
 * @returns {Object} Axios proxy configuration object
 */
export function getRandomProxy() {
  const randomIndex = Math.floor(Math.random() * PROXY_LIST.length);
  const proxyString = PROXY_LIST[randomIndex];
  const proxyConfig = createProxyConfig(proxyString);
  
  // Log which proxy is being used (for debugging)
  console.log(`[PROXY] Using proxy: ${proxyConfig.host}:${proxyConfig.port}`);
  
  return proxyConfig;
}

/**
 * Checks if a URL should use proxy rotation
 * @param {string} url - The URL to check
 * @returns {boolean} True if proxy should be used
 */
export function shouldUseProxy(url) {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname === PROXY_TARGET_DOMAIN;
  } catch (error) {
    return false;
  }
}

/**
 * Creates axios config with proxy if needed
 * @param {string} url - The URL for the request
 * @param {Object} baseConfig - Base axios configuration
 * @returns {Object} Axios configuration with proxy if applicable
 */
export function addProxyIfNeeded(url, baseConfig = {}) {
  if (shouldUseProxy(url)) {
    return {
      ...baseConfig,
      proxy: getRandomProxy()
    };
  }
  return baseConfig;
}
