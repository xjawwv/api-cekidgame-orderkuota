import express from "express";
import { getMutasi } from "../services/orderkuotaService.js";
import chalk from "chalk";

const router = express.Router();

const POLLING_INTERVAL = 5000;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
const parseAmount = (amountStr) => {
  if (!amountStr) return 0;
  return parseInt(amountStr.replace(/\D/g, ""), 10);
};
const getTimestamp = () => {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, "0");
  const m = String(now.getMinutes()).padStart(2, "0");
  const s = String(now.getSeconds()).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const logInfo = (msg) => console.log(chalk.blue(`[${getTimestamp()}][INFO] ${msg}`));
const logSuccess = (msg) => console.log(chalk.green(`[${getTimestamp()}][SUCCESS] ${msg}`));
const logWarn = (msg) => console.log(chalk.yellow(`[${getTimestamp()}][WARN] ${msg}`));
const logError = (msg) => console.log(chalk.red(`[${getTimestamp()}][ERROR] ${msg}`));

const sendPrettyJSON = (res, statusCode, obj) => {
  res.setHeader("Content-Type", "application/json");
  res.status(statusCode).send(JSON.stringify(obj, null, 2));
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

router.get("/:username/:token/:nominal/:starttime", async (req, res) => {
  const { username, token, nominal, starttime } = req.params;
  const targetNominal = parseInt(nominal, 10);
  let isConnectionClosed = false;

  req.on("close", () => {
    logWarn(`Client ${username} terputus.`);
    isConnectionClosed = true;
  });

  logInfo(`Polling start User=${username}, Nominal=${targetNominal}, StartTime=${starttime}`);

  try {
    while (!isConnectionClosed) {
      const mutasiData = await getMutasi(username, token, "IN");

      if (mutasiData?.qris_history?.success && Array.isArray(mutasiData.qris_history.results)) {
        const foundTransaction = mutasiData.qris_history.results.find(trx => {
          const trxNominal = parseAmount(trx.kredit);
          const trxDateTime = trx.tanggal || "";
          const trxTime = trxDateTime.split(" ")[1] || "";
          return trxNominal === targetNominal && trxTime >= starttime;
        });

        if (foundTransaction) {
          logSuccess(`Transaksi ditemukan untuk ${username} (Nominal=${foundTransaction.kredit}, Jam=${foundTransaction.tanggal})`);
          if (!res.headersSent) {
            sendPrettyJSON(res, 200, {
              success: true,
              data: foundTransaction
            });
          }
          return;
        }
      } else {
        logWarn(`Panggilan API ${username} tidak valid/empty`);
      }

      await sleep(POLLING_INTERVAL);
    }

    if (isConnectionClosed) {
      logWarn(`Polling ${username} dihentikan (client closed)`);
    }
  } catch (err) {
    logError(`[LONG POLLING] ${err.message}`);
    if (!res.headersSent) {
      sendPrettyJSON(res, 500, { success: false, message: err.message });
    }
  }
});

export default router;
