import express from "express";
import { checkName } from "../services/orderkuotaService.js";

const router = express.Router();

// Helper function to handle check name request
const handleCheckName = async (req, res, walletType) => {
  const { phone } = req.body;
  
  if (!phone) {
    return res.status(400).json({
      status: "error",
      message: "Phone number is required in body"
    });
  }

  // credentials
  const username = process.env.OK_USERNAME;
  const token = process.env.OK_TOKEN;

  if (!username || !token) {
    return res.status(500).json({
      status: "error",
      message: "Server misconfiguration: OK_USERNAME or OK_TOKEN not set in .env"
    });
  }

  try {
    const data = await checkName(username, token, phone, walletType);
    res.json(data);
  } catch (err) {
    console.error(`[CHECKNAME ${walletType.toUpperCase()}] Error:`, err.message);
    res.status(500).json({
      status: "error",
      message: err.message
    });
  }
};

// endpoint
router.post("/gopay", (req, res) => handleCheckName(req, res, "gopay"));
router.post("/dana", (req, res) => handleCheckName(req, res, "dana"));
router.post("/shopeepay", (req, res) => handleCheckName(req, res, "shopeepay"));
router.post("/ovo", (req, res) => handleCheckName(req, res, "ovo"));
router.post("/linkaja", (req, res) => handleCheckName(req, res, "linkaja"));

export default router;
