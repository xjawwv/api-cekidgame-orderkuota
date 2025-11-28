import express from "express";
import { checkGameId } from "../services/duniagamesService.js";

const router = express.Router();

// mlbb
router.post("/mobile-legends", async (req, res) => {
  let { id, zoneId } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Game ID is required in body"
    });
  }
  
  const match = id.match(/^(\d+)\((\d+)\)$/);
  if (match) {
    id = match[1];
    zoneId = match[2];
  }

  if (!id || !zoneId) {
    return res.status(400).json({
      status: "error",
      message: "Invalid format. Provide 'id' and 'zoneId' in body, or 'id' as 'gameId(zoneId)'."
    });
  }

  try {
    const data = await checkGameId('mobile-legends', id, zoneId);
    res.json(data);
  } catch (err) {
    console.error("[CHECKGAME MLBB] Error:", err.message);
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

// ff
router.post("/free-fire", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Game ID is required in body"
    });
  }

  try {
    const data = await checkGameId('free-fire', id);
    res.json(data);
  } catch (err) {
    console.error("[CHECKGAME FF] Error:", err.message);
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

// arena of valor
router.post("/arena-of-valor", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Game ID is required in body"
    });
  }

  try {
    const data = await checkGameId('arena-of-valor', id);
    res.json(data);
  } catch (err) {
    console.error("[CHECKGAME AOV] Error:", err.message);
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

// growtopia
router.post("/growtopia", async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({
      status: "error",
      message: "Game ID is required in body"
    });
  }

  try {
    const data = await checkGameId('growtopia', id);
    res.json(data);
  } catch (err) {
    console.error("[CHECKGAME GROWTOPIA] Error:", err.message);
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

// genshin impact
router.post("/genshin-impact", async (req, res) => {
  const { id, serverId, serverName } = req.body;

  if (!id || !serverId || !serverName) {
    return res.status(400).json({
      status: "error",
      message: "Fields 'id', 'serverId', and 'serverName' are required in body"
    });
  }

  try {
    const data = await checkGameId('genshin-impact', id, null, { serverId, serverName });
    res.json(data);
  } catch (err) {
    console.error("[CHECKGAME GENSHIN] Error:", err.message);
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
});

export default router;
