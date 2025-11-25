# 🔄 Mutasi QRIS API

API untuk monitoring mutasi transaksi QRIS melalui OrderKuota dengan fitur long polling dan generator QRIS dinamis.

## ✨ Fitur

- 🔍 **Monitoring Mutasi QRIS** - Ambil riwayat transaksi QRIS (masuk/keluar)
- ⏱️ **Long Polling** - Deteksi transaksi secara real-time dengan polling otomatis
- 🎯 **Filter Transaksi** - Filter berdasarkan nominal dan waktu transaksi
- 🖼️ **Generator QRIS** - Generate QR Code QRIS dengan nominal dinamis
- 🎨 **Pretty JSON Response** - Response API yang mudah dibaca

## 🚀 Instalasi

### Prerequisites

- Node.js (v14 atau lebih tinggi)
- Akun OrderKuota (harus bisa akun merchant)

### Setup

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd mutasi-qris
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```


3. **Jalankan aplikasi**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

Server akan berjalan di `http://localhost:3003`

## 📚 API Endpoints

### 1. Health Check

```http
GET /
```

**Response:**
```
Connected
```

---

### 2. Get Mutasi QRIS

Mengambil riwayat transaksi QRIS.

```http
GET /mutasi/:username/:token?jenis=IN
```

**Parameters:**
- `username` (path) - Username OrderKuota
- `token` (path) - Auth token OrderKuota (format: `userId:token`)
- `jenis` (query, optional) - Jenis transaksi: `IN` (masuk) atau `OUT` (keluar)

**Example Request:**
```bash
curl "http://localhost:3003/mutasi/myusername/2190277:xxxxxxxx?jenis=IN"
```

**Response:**
```json
{
  "qris_history": {
    "success": true,
    "results": [
      {
        "tanggal": "2024-01-20 14:30:25",
        "kredit": "Rp 15.000",
        "debit": "",
        "keterangan": "Transfer QRIS",
        "saldo": "Rp 100.000"
      }
    ]
  }
}
```

---

### 3. Long Polling - Deteksi Transaksi

Menunggu transaksi dengan nominal tertentu secara real-time.

```http
GET /mutasi/:username/:token/:nominal/:starttime
```

**Parameters:**
- `username` (path) - Username OrderKuota
- `token` (path) - Auth token OrderKuota
- `nominal` (path) - Nominal yang diharapkan (angka saja, tanpa "Rp")
- `starttime` (path) - Waktu mulai monitoring (format: `HH:MM:SS`)

**Example Request:**
```bash
curl "http://localhost:3003/mutasi/myusername/2190277:xxxxxxxx/15000/14:00:00"
```

**Response (ketika transaksi ditemukan):**
```json
{
  "success": true,
  "data": {
    "tanggal": "2024-01-20 14:30:25",
    "kredit": "Rp 15.000",
    "debit": "",
    "keterangan": "Transfer QRIS",
    "saldo": "Rp 100.000"
  }
}
```

**Cara Kerja:**
- API akan melakukan polling setiap 5 detik
- Mencari transaksi dengan nominal yang sesuai
- Hanya mendeteksi transaksi setelah `starttime`
- Response dikirim segera setelah transaksi ditemukan
- Connection otomatis ditutup jika client disconnect

---

### 4. Generate QRIS dengan Nominal

Generate QR Code QRIS dengan nominal dinamis.

```http
GET /qris/:qris_string/:nominal
```

**Parameters:**
- `qris_string` (path) - String QRIS dasar (tanpa nominal)
- `nominal` (path) - Nominal yang akan di-embed ke QRIS

**Example Request:**
```bash
curl "http://localhost:3003/qris/00020101021126670016COM.NOBUBANK.WWW01189360050300000898740214545006011234560303UMI51440014ID.CO.QRIS.WWW0215ID10200000000150303UMI5204581253033605802ID5906TOKO A6015KOTA YOGYAKARTA61055511262070703A016304/15000"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qris": "00020101021126670016COM.NOBUBANK.WWW...",
    "nominal": 15000,
    "image_url": "http://localhost:3003/qris/qris_15000_1756289132457.png"
  }
}
```

**Output:**
- QR Code disimpan di folder `src/public/qris/`
- Dapat diakses via URL yang dikembalikan
- Format file: `qris_{nominal}_{timestamp}.png`

---

## 🏗️ Struktur Folder

```
mutasi-qris/
├── src/
│   ├── index.js                    # Entry point aplikasi
│   ├── routes/
│   │   ├── mutasi.js               # Routes untuk mutasi QRIS
│   │   └── qrisRoutes.js           # Routes untuk generate QRIS
│   ├── services/
│   │   └── orderkuotaService.js    # Service OrderKuota API
│   ├── utils/
│   │   ├── env.js                  # Environment utilities
│   │   ├── logger.js               # Logging utilities
│   │   └── qrisGenerator.js        # QRIS generator logic
│   └── public/
│       └── qris/                   # Generated QR codes
├── .env                            # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🔧 Teknologi

- **Express.js** - Web framework
- **Axios** - HTTP client untuk OrderKuota API
- **QRCode** - Generator QR Code
- **Chalk** - Colored console logging
- **Dotenv** - Environment variable management

## 📝 Logging

API menggunakan colored logging untuk memudahkan monitoring:

- 🔵 **INFO** - Informasi umum (polling start, dll)
- 🟢 **SUCCESS** - Transaksi berhasil ditemukan
- 🟡 **WARN** - Warning (client disconnect, data kosong)
- 🔴 **ERROR** - Error yang terjadi

**Example Log:**
```
[14:30:25][INFO] Polling start User=myuser, Nominal=15000, StartTime=14:00:00
[14:30:30][SUCCESS] Transaksi ditemukan untuk myuser (Nominal=Rp 15.000, Jam=2024-01-20 14:30:25)
```

## 🔐 Keamanan

> [!WARNING]
> **Jangan commit file `.env` ke repository!** File ini berisi kredensial sensitif.

## 🐛 Troubleshooting

### Port sudah digunakan

Jika port 3003 sudah digunakan, ubah di file `.env`:
```env
PORT=3004
```

### Transaksi tidak terdeteksi

Periksa:
1. Format `starttime` sudah benar (HH:MM:SS)
2. Nominal sesuai dengan yang ada di transaksi
3. Token masih valid
4. Environment variables sudah dikonfigurasi dengan benar

## 📄 License

MIT License

## 👨‍💻 Author

Dibuat dengan ❤️ untuk monitoring transaksi QRIS

---

## 🤝 Contributing

Contributions, issues, dan feature requests sangat diterima!

## ⭐ Support

Jika project ini membantu, berikan ⭐ di repository!
