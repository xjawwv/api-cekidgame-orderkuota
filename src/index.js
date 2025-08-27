import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import mutasiRoutes from "./routes/mutasi.js";
import qrisRoutes from "./routes/qrisRoutes.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3002;

// ====== Fix path & __dirname ======
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ====== Static files ======
app.use(express.static(path.join(__dirname, "public"))); // akses global: http://localhost:3002/<file>
app.use("/qris", express.static(path.join(__dirname, "public/qris"))); // akses: http://localhost:3002/qris/<file>.png

// ====== Routes ======
app.use("/mutasi", mutasiRoutes);
app.use("/qris", qrisRoutes);

app.listen(PORT, () => {
  console.log(`✅ API OrderKuota running at http://localhost:${PORT}`);
});
