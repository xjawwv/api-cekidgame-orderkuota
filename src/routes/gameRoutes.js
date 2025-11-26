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

export default router;