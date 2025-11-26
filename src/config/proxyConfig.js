// src/config/proxyConfig.js

/**
 * List of IPv4 proxies for rotating requests to app.orderkuota.com
 * Format: ip:port:username:password
 */
export const PROXY_LIST = [
  "142.111.48.253:7030:qfjobgie:zjzbwie4wdlt",
  "31.59.20.176:6754:qfjobgie:zjzbwie4wdlt",
  "23.95.150.145:6114:qfjobgie:zjzbwie4wdlt",
  "198.23.239.134:6540:qfjobgie:zjzbwie4wdlt",
  "107.172.163.27:6543:qfjobgie:zjzbwie4wdlt",
  "198.105.121.200:6462:qfjobgie:zjzbwie4wdlt",
  "64.137.96.74:6641:qfjobgie:zjzbwie4wdlt",
  "84.247.60.125:6095:qfjobgie:zjzbwie4wdlt",
  "216.10.27.159:6837:qfjobgie:zjzbwie4wdlt",
  "142.111.67.146:5611:qfjobgie:zjzbwie4wdlt"
];

/**
 * Target domain that requires proxy rotation
 */
export const PROXY_TARGET_DOMAIN = "app.orderkuota.com";
