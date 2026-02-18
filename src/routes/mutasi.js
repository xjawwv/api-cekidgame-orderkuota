import express from "express";
import { getMutasi } from "../services/orderkuotaService.js";
import { getEnv } from "../utils/env.js";
import chalk from "chalk";

const router = express.Router();

// simple polling route will be used below

const getTimestamp = () => {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
};


const logError = (msg) => console.log(chalk.red(`[${getTimestamp()}][ERROR] ${msg}`));

const sendPrettyJSON = (res, statusCode, obj) => {
  res.setHeader("Content-Type", "application/json");
  res.status(statusCode).send(JSON.stringify(obj, null, 2));
};

const parseTimeParam = (value) => {
  if (!value) return null;
  const match = String(value).trim().match(/^(\d{1,2})[.:](\d{2})$/);
  if (!match) return null;
  const hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;
  return hours * 60 + minutes;
};

const toInt = (value) => {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).replace(/[^\d-]/g, "");
  if (!cleaned) return null;
  const num = Number.parseInt(cleaned, 10);
  return Number.isNaN(num) ? null : num;
};

const WINDOW_MINUTES = 10;

const candidateTimeFields = [
  "timestamp",
  "created_at",
  "createdAt",
  "datetime",
  "date",
  "tanggal",
  "waktu",
  "time",
];

const getMinutesOfDay = (date) => date.getHours() * 60 + date.getMinutes();

const extractTimeMinutes = (raw) => {
  if (raw === null || raw === undefined) return null;

  // numeric timestamps (seconds or ms)
  if (typeof raw === "number" || (/^\d+$/.test(String(raw)))) {
    const num = Number(raw);
    if (Number.isFinite(num)) {
      const ms = num > 10_000_000_000 ? num : num * 1000; // heuristic for s vs ms
      const dt = new Date(ms);
      if (!Number.isNaN(dt.getTime())) return getMinutesOfDay(dt);
    }
  }

  const str = String(raw).trim();

  // ISO or date-like strings
  const asDate = new Date(str);
  if (!Number.isNaN(asDate.getTime())) {
    return getMinutesOfDay(asDate);
  }

  // HH:mm or HH.mm (optionally with seconds)
  const m = str.match(/(\d{1,2})[:.](\d{2})(?::\d{2})?/);
  if (m) {
    const h = Number.parseInt(m[1], 10);
    const mi = Number.parseInt(m[2], 10);
    if (h >= 0 && h <= 23 && mi >= 0 && mi <= 59) {
      return h * 60 + mi;
    }
  }

  return null;
};

const extractTransactions = (payload) => {
  const list = [];
  if (!payload || typeof payload !== "object") return list;

  if (Array.isArray(payload)) list.push(...payload);
  if (Array.isArray(payload.data)) list.push(...payload.data);

  const qrisHistory = payload.qris_history || payload.qrisHistory;
  if (qrisHistory) {
    if (Array.isArray(qrisHistory.data)) list.push(...qrisHistory.data);
    if (Array.isArray(qrisHistory.result)) list.push(...qrisHistory.result);
    if (Array.isArray(qrisHistory.results)) list.push(...qrisHistory.results);
  }

  return list;
};

const isWithinWindow = (minutes, startMinutes) => {
  if (minutes === null) return false;
  const endMinutes = startMinutes + WINDOW_MINUTES;

  if (endMinutes < 1440) {
    return minutes >= startMinutes && minutes <= endMinutes;
  }

  const wrappedEnd = endMinutes - 1440;
  return minutes >= startMinutes || minutes <= wrappedEnd;
};

const findMatchingTransaction = (payload, targetNominal, startMinutes) => {
  const candidates = extractTransactions(payload);

  return candidates.find((trx) => {
    const amount = toInt(
      trx?.jumlah ??
      trx?.nominal ??
      trx?.amount ??
      trx?.total ??
      trx?.value ??
      trx?.kredit ??
      trx?.credit ??
      trx?.debet ??
      trx?.debit
    );
    if (amount !== targetNominal) return false;

    let trxMinutes = null;
    for (const key of candidateTimeFields) {
      if (trxMinutes !== null) break;
      trxMinutes = extractTimeMinutes(trx?.[key]);
    }
    if (trxMinutes === null) {
      trxMinutes = extractTimeMinutes(trx);
    }

    return isWithinWindow(trxMinutes, startMinutes);
  }) || null;
};

router.get("/:username/:token", async (req, res) => {
  const { username, token } = req.params;
  const { jenis } = req.query;
  try {
    const data = await getMutasi(username, token, jenis);
    sendPrettyJSON(res, 200, data);
  } catch (err) {
    logError(`[MUTASI] ${err.message}`);
    sendPrettyJSON(res, 500, { success: false, message: err.message });
  }
});

router.get("/:username/:token/:nominal/:time", async (req, res) => {
  const { username, token, nominal, time } = req.params;
  const { jenis } = req.query;

  const targetNominal = toInt(nominal);
  const startMinutes = parseTimeParam(time);

  if (targetNominal === null) {
    return sendPrettyJSON(res, 400, { success: false, message: "Nominal tidak valid" });
  }

  if (startMinutes === null) {
    return sendPrettyJSON(res, 400, { success: false, message: "Format time tidak valid (gunakan HH.MM atau HH:MM, contoh 00.58)" });
  }

  try {
    const data = await getMutasi(username, token, jenis);
    const match = findMatchingTransaction(data, targetNominal, startMinutes);

    if (match) {
      return sendPrettyJSON(res, 200, {
        success: true,
        message: "Transaksi ditemukan",
        nominal: targetNominal,
        time_from: time,
        window_minutes: WINDOW_MINUTES,
        match
      });
    }

    return sendPrettyJSON(res, 404, {
      success: false,
      message: `Tidak ada transaksi nominal ${targetNominal} sejak ${time} (jangka ${WINDOW_MINUTES} menit)`
    });
  } catch (err) {
    logError(`[MUTASI] ${err.message}`);
    sendPrettyJSON(res, 500, { success: false, message: err.message });
  }
});

router.get("/xjaww/:nominal/:time", async (req, res) => {
  const username = getEnv("username") || getEnv("OK_USERNAME") || process.env.OK_USERNAME;
  const token = getEnv("token") || getEnv("OK_TOKEN") || process.env.OK_TOKEN;

  const { nominal, time } = req.params;
  const targetNominal = toInt(nominal);
  const startMinutes = parseTimeParam(time);

  if (targetNominal === null) {
    return sendPrettyJSON(res, 400, { success: false, message: "Nominal tidak valid" });
  }

  if (startMinutes === null) {
    return sendPrettyJSON(res, 400, { success: false, message: "Format time tidak valid (gunakan HH.MM atau HH:MM, contoh 00.58)" });
  }

  if (!username || !token) {
    return sendPrettyJSON(res, 500, { success: false, message: "Konfigurasi username/token tidak ditemukan di .env" });
  }


  // start polling and hold the HTTP response until found or timeout
  const intervalMs = 5000; // poll setiap 5 detik
  const maxMs = WINDOW_MINUTES * 60 * 1000; // batas atas 10 menit

  let finished = false;
  const cleanup = (intervalId, timeoutId) => {
    if (intervalId) clearInterval(intervalId);
    if (timeoutId) clearTimeout(timeoutId);
  };

  const attempt = async () => {
    try {
      const data = await getMutasi(username, token);
      const match = findMatchingTransaction(data, targetNominal, startMinutes);
      if (match) {
        finished = true;
        return { found: true, match, data };
      }
      return { found: false };
    } catch (err) {
      logError(`[MUTASI:xjaww] ${err.message}`);
      return { found: false, error: err };
    }
  };

  try {
    const first = await attempt();
    if (first.found) {
      return sendPrettyJSON(res, 200, { success: true, message: "Transaksi ditemukan", nominal: targetNominal, time_from: time, window_minutes: WINDOW_MINUTES, match: first.match });
    }

    const intervalId = setInterval(async () => {
      if (finished) return;
      const result = await attempt();
      if (result.found) {
        cleanup(intervalId, timeoutId);
        finished = true;
        try {
          sendPrettyJSON(res, 200, { success: true, message: "Transaksi ditemukan", nominal: targetNominal, time_from: time, window_minutes: WINDOW_MINUTES, match: result.match });
        } catch (e) {
          /* client disconnected */
        }
      }
    }, intervalMs);

    const timeoutId = setTimeout(() => {
      if (finished) return;
      cleanup(intervalId, timeoutId);
      finished = true;
      try {
        sendPrettyJSON(res, 404, { success: false, message: `Tidak ada transaksi nominal ${targetNominal} sejak ${time} (jangka ${WINDOW_MINUTES} menit)` });
      } catch (e) {
        /* client disconnected */
      }
    }, maxMs);

    req.on("close", () => {
      cleanup(intervalId, timeoutId);
      finished = true;
    });
  } catch (err) {
    logError(`[MUTASI:xjaww] ${err.message}`);
    return sendPrettyJSON(res, 500, { success: false, message: err.message });
  }
});

  // no SSE: simple polling-only behavior (response handled above)



export default router;
