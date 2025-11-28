import axios from "axios";

const API_URL = "https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store";

const BASE_HEADERS = {
  "sec-ch-ua-platform": '"Android"',
  "ciam-type": "FR",
  "accept-language": "id",
  "sec-ch-ua": '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
  "x-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoie1wibXNpc2RuXCI6XCIwODEyOTk1NjUxNTlcIn0iLCJleHAiOjE3NjQzMzQ5Mjl9.-GRxJKdhZQBegccSgjzwx1FDw28oTGV2NNXjgP2dHkk",
  "sec-ch-ua-mobile": "?1",
  "x-device": "47eedcca-28c8-4d15-8f05-326849f0feca",
  "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36",
  "accept": "application/json, text/plain, */*",
  "content-type": "application/json",
  "origin": "https://duniagames.co.id",
  "sec-fetch-site": "same-site",
  "sec-fetch-mode": "cors",
  "sec-fetch-dest": "empty",
  "referer": "https://duniagames.co.id/",
  "accept-encoding": "gzip, deflate, br, zstd",
  "priority": "u=1, i"
};

// konfigurasi cek id game
const GAME_CONFIG = {
  'mobile-legends': {
    productId: 1,
    itemId: 1346,
    catalogId: 2526,
    paymentId: 6515,
    requiresZoneId: true
  },
  'free-fire': {
    productId: 3,
    itemId: 12,
    catalogId: 67,
    paymentId: 5406,
    requiresZoneId: false
  },
  'arena-of-valor': {
    productId: 4,
    itemId: 18,
    product_ref: 'REG',
    product_ref_denom: 'REG',
    catalogId: 73,
    paymentId: 757,
    requiresZoneId: false
  },
  'growtopia': {
    productId: 143,
    itemId: 1512,
    product_ref: 'REG',
    product_ref_denom: 'REG',
    catalogId: 2694,
    paymentId: 7451,
    requiresZoneId: false
  },
  'genshin-impact': {
    productId: 187,
    itemId: 2127,
    product_ref: 'REG',
    product_ref_denom: 'REG',
    catalogId: 3305,
    paymentId: 8919,
    requiresZoneId: false,
    requiresServer: true,
  }
};

/**
 * Check game ID for specific games.
 * @param {string} gameCode - Internal game code.
 * @param {string} gameId - The user ID in the game.
 * @param {string|null} zoneId - The zone ID (required for MLBB, null for others).
 * @param {object} extraParams - Additional params per game (e.g., serverId, serverName).
 * @returns {Promise<any>} API response data.
 */
export async function checkGameId(gameCode, gameId, zoneId = null, extraParams = {}) {
  const config = GAME_CONFIG[gameCode];

  if (!config) {
    throw new Error(`Configuration not found for game: ${gameCode}`);
  }

  const payload = {
    productId: config.productId,
    itemId: config.itemId,
    product_ref: config.product_ref || "REG",
    product_ref_denom: config.product_ref_denom || "REG",
    catalogId: config.catalogId,
    paymentId: config.paymentId,
    gameId: gameId,
    campaignUrl: ""
  };
  
  if (config.requiresZoneId) {
    const resolvedZoneId = extraParams.zoneId || zoneId;
    if (!resolvedZoneId) throw new Error(`${gameCode} requires a Zone ID.`);
    payload.zoneId = resolvedZoneId;
  }

  if (config.requiresServer) {
    const { serverId, serverName } = extraParams;
    if (!serverId || !serverName) {
      throw new Error(`${gameCode} requires serverId and serverName.`);
    }
    payload.serverId = serverId;
    payload.serverName = serverName;
  }

  // Merge base headers with game-specific extra headers
  const headers = {
    ...BASE_HEADERS,
    ...(config.extraHeaders || {})
  };

  try {
    const { data } = await axios.post(API_URL, payload, { headers });
    if (data && data.data && data.data.gameDetail) {
      return { gameDetail: data.data.gameDetail };
    }
    return data;
  } catch (error) {
    if (error.response) {
      // Handle 400 error (ID not found)
      if (error.response.status === 400) {
        throw new Error("ID game tidak ditemukan atau tidak valid");
      }
      // Handle other HTTP errors
      throw new Error(error.response.data.message || error.message);
    }
    // Handle network or other errors
    throw error;
  }
}
