import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import mutasiRoutes from "./routes/mutasi.js";
import qrisRoutes from "./routes/qrisRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3003;

// ====== Fix path & __dirname ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== Static files ======
// ====== Static files ======
app.use(express.static(path.join(__dirname, "../public"))); // akses global: http://localhost:3003/<file>
app.use("/qris", express.static(path.join(__dirname, "../public/qris"))); // akses: http://localhost:3002/qris/<file>.png

// ====== Middleware ======
app.use(cors()); // Enable CORS for all routes
app.use(express.json());

// ====== Routes ======
app.get("/", (req, res) => {
  res.send("Connected");
});
app.use("/mutasi", mutasiRoutes);
app.use("/qris", qrisRoutes);

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
