import express from "express";
import { getMutasi } from "../services/orderkuotaService.js";
import chalk from "chalk";

const router = express.Router();


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



export default router;
