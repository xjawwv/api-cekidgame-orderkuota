# API CekIDGame & OrderKuota

API untuk melakukan pengecekan nama e-wallet, validasi Game ID, generate QRIS dinamis, dan cek mutasi transaksi menggunakan integrasi OrderKuota dan DuniaGames.

## 📋 Fitur

- ✅ **E-wallet Checkname** - Validasi nomor telepon untuk berbagai e-wallet (Gopay, Dana, ShopeePay, OVO, LinkAja)
- 🎮 **Game ID Checkname** - Validasi Game ID untuk Mobile Legends dan Free Fire
- 💳 **QRIS Generator** - Generate QRIS dinamis dengan nominal custom
- 📊 **Mutasi Transaksi** - Cek riwayat mutasi transaksi QRIS

## 🚀 Instalasi

### Prerequisites

- Node.js (v14 atau lebih tinggi)
- npm atau yarn
- Akun OrderKuota (untuk kredensial API)

### Langkah Instalasi

1. Clone repository ini:
```bash
git clone https://github.com/yourusername/api-cekidgame-orderkuota.git
cd api-cekidgame-orderkuota
```

2. Install dependencies:
```bash
npm install
```

3. Buat file `.env` di root directory:
```env
PORT=3003
OK_USERNAME=your_orderkuota_username
OK_TOKEN=your_orderkuota_token
```

4. Jalankan aplikasi:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

Server akan berjalan di `http://localhost:3003`

## 📚 API Endpoints

### 1. E-wallet Checkname

Validasi nomor telepon untuk berbagai e-wallet.

#### **POST** `/e-wallet/gopay`
Cek nama akun Gopay berdasarkan nomor telepon.


#### **POST** `/e-wallet/dana`
Cek nama akun Dana.

#### **POST** `/e-wallet/shopeepay`
Cek nama akun ShopeePay.

#### **POST** `/e-wallet/ovo`
Cek nama akun OVO.

#### **POST** `/e-wallet/linkaja`
Cek nama akun LinkAja.

    > **Note:** Semua endpoint e-wallet menggunakan format request dan response yang sama seperti contoh Gopay di atas.
**Request Body:**
```json
{
  "phone": "08123456789"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "name": "John Doe",
    "phone": "08123456789"
  }
}
```


---

### 2. Game ID Checkname

Validasi Game ID untuk berbagai game populer.

#### **POST** `/game/mobile-legends`
Validasi Game ID Mobile Legends (MLBB).

**Request Body (Format 1):**
```json
{
  "id": "123456789",
  "zoneId": "1234"
}
```

**Request Body (Format 2):**
```json
{
  "id": "123456789(1234)"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "gameId": "123456789",
    "zoneId": "1234",
    "username": "PlayerName"
  }
}
```

#### **POST** `/game/free-fire`
Validasi Game ID Free Fire.

**Request Body:**
```json
{
  "id": "123456789"
}
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "gameId": "123456789",
    "username": "PlayerName"
  }
}
```

---

### 3. QRIS Generator

Generate QRIS dinamis dengan nominal custom.

#### **GET** `/qris/:qris_string/:nominal`

**Parameters:**
- `qris_string` - String QRIS asli
- `nominal` - Nominal yang ingin di-set (dalam Rupiah)

**Example:**
```
GET /qris/00020101021126670016ID.CO.SHOPEE.WWW011893600915123456789021234567890303UME51440014ID.CO.QRIS.WWW0215ID20232345678900303UME5204581253033605802ID5913MERCHANT_NAME6011KOTA_JAKARTA61051234062070703A016304ABCD/50000
```

**Response:**
```json
{
  "success": true,
  "data": {
    "qris": "00020101021126670016ID.CO.SHOPEE.WWW...",
    "nominal": 50000,
    "image_url": "http://localhost:3003/qris/qris_50000_1234567890.png"
  }
}
```

> **Note:** File QR Code akan disimpan di folder `public/qris/` dan dapat diakses melalui URL yang dikembalikan.

---

### 4. Mutasi Transaksi

Cek riwayat mutasi transaksi QRIS.

#### **GET** `/mutasi/:username/:token`

**Parameters:**
- `username` - Username OrderKuota
- `token` - Token OrderKuota

**Query Parameters:**
- `jenis` (optional) - Jenis mutasi (default: semua)

**Example:**
```
GET /mutasi/your_username/your_token?jenis=qris
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "TRX123456",
      "amount": 50000,
      "type": "credit",
      "description": "QRIS Payment",
      "timestamp": "2025-11-26T12:00:00Z"
    }
  ]
}
```

---

## 🛠️ Struktur Folder

```
api-cekidgame-orderkuota/
├── src/
│   ├── routes/
│   │   ├── ewalletRoutes.js    # Routes untuk e-wallet checkname
│   │   ├── gameRoutes.js        # Routes untuk game ID validation
│   │   ├── mutasi.js            # Routes untuk mutasi transaksi
│   │   └── qrisRoutes.js        # Routes untuk QRIS generator
│   ├── services/
│   │   ├── orderkuotaService.js # Service OrderKuota API
│   │   └── duniagamesService.js # Service DuniaGames API
│   ├── utils/
│   │   ├── env.js               # Environment utilities
│   │   ├── logger.js            # Logging utilities
│   │   └── qrisGenerator.js     # QRIS generation logic
│   └── index.js                 # Entry point
├── public/
│   └── qris/                    # Folder untuk menyimpan QR codes
├── .env                         # Environment variables
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Environment Variables

Buat file `.env` dengan konfigurasi berikut:

```env
# Server Configuration
PORT=3003

# OrderKuota Credentials
OK_USERNAME=your_orderkuota_username
OK_TOKEN=your_orderkuota_token
```

## 📝 Error Handling

API ini menggunakan format error response yang konsisten:

```json
{
  "status": "error",
  "message": "Error description here"
}
```

**Common Error Codes:**
- `400` - Bad Request (parameter tidak valid)
- `500` - Internal Server Error (kesalahan server atau API eksternal)

## 🧪 Testing

Anda dapat menggunakan tools seperti Postman, Insomnia, atau curl untuk testing API.

### Contoh Testing dengan curl:

```bash
# Test E-wallet Checkname (Gopay)
curl -X POST http://localhost:3003/e-wallet/gopay \
  -H "Content-Type: application/json" \
  -d '{"phone": "08123456789"}'

# Test Game ID Checkname (Mobile Legends)
curl -X POST http://localhost:3003/game/mobile-legends \
  -H "Content-Type: application/json" \
  -d '{"id": "123456789", "zoneId": "1234"}'

# Test QRIS Generator
curl http://localhost:3003/qris/YOUR_QRIS_STRING/50000

# Test Mutasi
curl http://localhost:3003/mutasi/your_username/your_token
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**xJAWW**

## 🙏 Acknowledgments

- [OrderKuota](https://orderkuota.id) - E-wallet API provider
- [DuniaGames](https://duniagames.co.id) - Game ID validation provider
- [Express.js](https://expressjs.com) - Web framework
- [QRCode](https://www.npmjs.com/package/qrcode) - QR code generator

---

**⚠️ Disclaimer:** API ini dibuat untuk keperluan edukasi dan development. Pastikan Anda memiliki izin yang sesuai sebelum menggunakan API pihak ketiga dalam production.
