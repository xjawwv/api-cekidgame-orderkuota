import express from "express";
import { checkName } from "../services/orderkuotaService.js";

const router = express.Router();

// helper
const handleCheckName = async (req, res, walletType) => {
  const { phone } = req.params;
  
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
router.get("/gopay/:phone", (req, res) => handleCheckName(req, res, "gopay"));
router.get("/dana/:phone", (req, res) => handleCheckName(req, res, "dana"));
router.get("/shopeepay/:phone", (req, res) => handleCheckName(req, res, "shopeepay"));
router.get("/ovo/:phone", (req, res) => handleCheckName(req, res, "ovo"));
router.get("/linkaja/:phone", (req, res) => handleCheckName(req, res, "linkaja"));

export default router;
