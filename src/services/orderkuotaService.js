// src/services/orderkuotaService.js
import axios from "axios";

const API_ORIGIN = "https://app.orderkuota.com";
const API_QRIS   = `${API_ORIGIN}/api/v2/qris/mutasi`; // /:userId

// versi & identitas app (isi via .env)
const APP_VERSION_NAME = process.env.OK_APP_VERSION_NAME || "25.08.11";
const APP_VERSION_CODE = process.env.OK_APP_VERSION_CODE || "250811";
const APP_PACKAGE      = "com.orderkuota.app";                // tetap
const APP_REG_ID       = process.env.OK_APP_REG_ID || "";     // WAJIB diisi

// device info dari capture
const PHONE_UUID   = process.env.OK_PHONE_UUID || "";
const PHONE_MODEL  = process.env.OK_PHONE_MODEL || "";
const PHONE_ANDROID_VERSION = process.env.OK_PHONE_ANDROID_VERSION || "15";
const UI_MODE      = "light";

// optional: signature header (kalau ada di capture-mu)
const SIG          = process.env.OK_SIGNATURE || "";
const SIG_TS       = process.env.OK_SIGNATURE_TIMESTAMP || "";

/**
 * Encodes a JavaScript object into a URL-encoded form string.
 * @param {Record<string, any>} obj - The object to encode.
 * @returns {string} The URL-encoded string.
 */
export function encodeForm(obj) {
  return Object.entries(obj)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v ?? "")}`)
    .join("&");
}

/**
 * Fetches the mutation history from the OrderKuota API.
 * @param {string} username - The user's username.
 * @param {string} token - The user's authentication token.
 * @param {string} [jenis=""] - The type of transaction to filter ("IN" or "OUT"). Defaults to all.
 * @returns {Promise<any>} The data returned from the API.
 */
export async function getMutasi(username, token, jenis = "") {
  // === ambil userId dari token: "2190277:xxxxxxxx"
  const userId = String((token || "").split(":")[0] || "").trim();
  if (!/^\d+$/.test(userId)) {
    throw new Error("User ID tidak benar!");
  }

  const headers = {
    "User-Agent": "okhttp/4.12.0",
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept-Encoding": "gzip",
    "x-app-version-name": APP_VERSION_NAME,
    "x-app-version-code": APP_VERSION_CODE,
    "x-app-package": APP_PACKAGE,
  };
  if (SIG)    headers["signature"] = SIG;
  if (SIG_TS) headers["timestamp"] = SIG_TS;

  const nowMs = Date.now();
  const form = {
    app_reg_id: APP_REG_ID,
    phone_uuid: PHONE_UUID,
    phone_model: PHONE_MODEL,
    request_time: String(nowMs),
    phone_android_version: PHONE_ANDROID_VERSION,

    app_version_code: APP_VERSION_CODE,
    app_version_name: APP_VERSION_NAME,
    ui_mode: UI_MODE,

    auth_username: username,
    auth_token: token,

    // qris_history block for fetching the latest transactions
    "requests[qris_history][keterangan]": "",
    "requests[qris_history][jumlah]": "",
    "requests[qris_history][page]": "1", // Always fetch the first page for the latest data
    "requests[qris_history][dari_tanggal]": "",
    "requests[qris_history][ke_tanggal]": "",
    // Filter by "IN" or "OUT" if provided
    "requests[qris_history][jenis]": jenis || "",

    "requests[0]": "account",
  };

  const url = `${API_QRIS}/${encodeURIComponent(userId)}`;
  const body = encodeForm(form);

  const { data } = await axios.post(url, body, { headers });

  // If the server rejects the request, data.qris_history.success might be false.
  // The polling logic in index.js will handle this.
  return data;
}

/**
 * Checks the name of an E-wallet account.
 * @param {string} username - The user's username.
 * @param {string} token - The user's authentication token.
 * @param {string} phone - The phone number to check.
 * @param {string} walletType - The type of e-wallet (gopay, dana, shopeepay, ovo, linkaja).
 * @returns {Promise<any>} The data returned from the API.
 */
export async function checkName(username, token, phone, walletType) {
  const userId = String((token || "").split(":")[0] || "").trim();
  
  // Constants observed from the user's request
  const PRODUCT_HASH = "34ca651a6bfe0325fe99d37395132243c95a8fea49";
  const UNKNOWN_ID = "26";
  
  // Construct the URL
  // https://checker.orderkuota.com/api/checkname/produk/{hash}/{id}/{userId}/{walletType}
  const baseUrl = `https://checker.orderkuota.com/api/checkname/produk/${PRODUCT_HASH}/${UNKNOWN_ID}/${userId}/${walletType}`;
  
  // Query parameters
  const queryParams = new URLSearchParams({
    phone: phone,
    cust_id: "",
    b: "2282", // Mocked values from capture
    t: "89176e71"
  });
  
  const url = `${baseUrl}?${queryParams.toString()}`;

  const headers = {
    "User-Agent": "okhttp/4.12.0",
    "Content-Type": "application/x-www-form-urlencoded",
    "Accept-Encoding": "gzip",
    "x-app-version-name": APP_VERSION_NAME,
    "x-app-version-code": APP_VERSION_CODE,
    "x-app-package": APP_PACKAGE,
  };
  if (SIG)    headers["signature"] = SIG;
  if (SIG_TS) headers["timestamp"] = SIG_TS;

  const nowMs = Date.now();
  const form = {
    app_reg_id: APP_REG_ID,
    phone_uuid: PHONE_UUID,
    phone_model: PHONE_MODEL,
    phoneNumber: phone,
    request_time: String(nowMs),
    phone_android_version: PHONE_ANDROID_VERSION,
    app_version_code: APP_VERSION_CODE,
    auth_username: username,
    customerId: "",
    id: walletType,
    auth_token: token,
    app_version_name: APP_VERSION_NAME,
    ui_mode: UI_MODE
  };

  const body = encodeForm(form);

  try {
    const { data } = await axios.post(url, body, { headers });
    return data;
  } catch (error) {
    // Handle axios errors
    if (error.response) {
      throw new Error(error.response.data.message || error.message);
    }
    throw error;
  }
}
