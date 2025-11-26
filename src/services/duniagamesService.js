import axios from "axios";

const API_URL = "https://api.duniagames.co.id/api/transaction/v1/top-up/inquiry/store";

const HEADERS = {
  "sec-ch-ua-platform": '"Android"',
  "ciam-type": "FR",
  "accept-language": "id",
  "sec-ch-ua": '"Chromium";v="142", "Google Chrome";v="142", "Not_A Brand";v="99"',
  "x-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoie1wibXNpc2RuXCI6XCIwODEyOTk1NjUxNTlcIn0iLCJleHAiOjE3NjQxMzM3NzN9.422ddx0J-4-KkYsQE-YwaFMOUtr4oWmOng2nFVFnBPI",
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
  }
};

/**
 * Check game ID for specific games.
 * @param {string} gameCode - The internal game code ('mobile-legends' or 'free-fire').
 * @param {string} gameId - The user ID in the game.
 * @param {string|null} zoneId - The zone ID (required for MLBB, null for FF).
 * @returns {Promise<any>} API response data.
 */
export async function checkGameId(gameCode, gameId, zoneId = null) {
  const config = GAME_CONFIG[gameCode];

  if (!config) {
    throw new Error(`Configuration not found for game: ${gameCode}`);
  }

  const payload = {
    productId: config.productId,
    itemId: config.itemId,
    product_ref: "REG",
    product_ref_denom: "REG",
    catalogId: config.catalogId,
    paymentId: config.paymentId,
    gameId: gameId,
    campaignUrl: ""
  };
  
  if (config.requiresZoneId) {
    if (!zoneId) throw new Error(`${gameCode} requires a Zone ID.`);
    payload.zoneId = zoneId;
  }

  try {
    const { data } = await axios.post(API_URL, payload, { headers: HEADERS });
    if (data && data.data && data.data.gameDetail) {
      return { gameDetail: data.data.gameDetail };
    }
    return data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || error.message);
    }
    throw error;
  }
}