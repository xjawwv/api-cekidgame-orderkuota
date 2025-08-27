import express from "express";
import fs from "fs";
import path from "path";
import QRCode from "qrcode";
import { fileURLToPath } from "url";
import { generateQris } from "../utils/qrisGenerator.js";

const router = express.Router();

// ===== Setup path public/qris =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const qrisDir = path.join(__dirname, "..", "public", "qris");
fs.mkdirSync(qrisDir, { recursive: true });

/**
 * Generate QRIS + nominal, simpan ke folder public/qris
 * Contoh: GET /qris/:qris_string/:nominal
 */
router.get("/:qris_string/:nominal", async (req, res) => {
  try {
    const { qris_string, nominal } = req.params;
    const qrisFinal = generateQris(qris_string, parseInt(nominal, 10));

    // Buat nama file unik (misalnya: qris_<nominal>_<timestamp>.png)
    const fileName = `qris_${nominal}_${Date.now()}.png`;
    const filePath = path.join(qrisDir, fileName);

    // Generate dan simpan PNG
    await QRCode.toFile(filePath, qrisFinal, {
      errorCorrectionLevel: "H",
      type: "png",
      width: 400,
      margin: 2
    });

    // URL untuk diakses public
    const imageUrl = `${req.protocol}://${req.get("host")}/qris/${fileName}`;

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({
      success: true,
      data: {
        qris: qrisFinal,
        nominal: parseInt(nominal, 10),
        image_url: imageUrl
      }
    }, null, 2));
  } catch (err) {
    console.error("[QRIS ERROR]", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
