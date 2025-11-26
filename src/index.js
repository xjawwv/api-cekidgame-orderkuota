import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import mutasiRoutes from "./routes/mutasi.js";
import qrisRoutes from "./routes/qrisRoutes.js";
import ewalletRoutes from "./routes/ewalletRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3003;

// ====== Fix path & __dirname ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== Static files ======
app.use(express.static(path.join(__dirname, "../public"))); // akses global: http://localhost:3003/<file>
app.use("/qris", express.static(path.join(__dirname, "../public/qris"))); // akses: http://localhost:3002/qris/<file>.png

// ====== Middleware ======
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====== Routes ======
app.get("/", (req, res) => {
  res.send("Connected");
});
app.use("/mutasi", mutasiRoutes);
app.use("/qris", qrisRoutes);
app.use("/e-wallet", ewalletRoutes);
app.use("/game", gameRoutes);

const server = app.listen(PORT, () => {
  console.log(`✅ API OrderKuota running at http://localhost:${PORT}`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please use a different port.`);
    process.exit(1);
  } else {
    console.error(e);
  }
});
