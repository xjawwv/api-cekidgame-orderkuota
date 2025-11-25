# Mutasi QRIS & Tripay-like Checkout

This project implements a custom API for handling transactions and a frontend checkout page that mimics the design of Tripay. It includes QRIS generation (mock/placeholder) and a real-time checkout UI.

## Features

-   **Custom Transaction API**: Create and retrieve transaction details.
-   **Tripay-like UI**: A beautiful, responsive checkout page with a countdown timer, QR code display, and order details.
-   **QRIS Integration**: (Mock) Generates QRIS strings for payments.
-   **Real-time Updates**: (Simulated) Polling for transaction status (UI ready).

## Prerequisites

-   Node.js (v14 or higher)
-   npm

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd mutasi-qris
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Usage

### Starting the Server

To start the server, run:

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The server will start on `http://localhost:3003` (or the port defined in your `.env` file).

### Creating a Transaction

To create a new transaction, send a POST request to `/transaction/create`:

**Endpoint:** `POST http://localhost:3003/transaction/create`

**Body (JSON):**

```json
{
  "amount": 171940,
  "customer_name": "John Doe",
  "customer_email": "john@example.com",
  "order_items": [
    { "name": "SPEED HUB (PERMANENT)", "price": 170000, "quantity": 1 },
    { "name": "Admin Fee", "price": 1940, "quantity": 1 }
  ]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "reference": "TRX1764075...",
    "checkout_url": "http://localhost:3003/checkout.html?ref=TRX1764075...",
    ...
  }
}
```

### Accessing the Checkout Page

Open the `checkout_url` provided in the API response in your browser.

Example: `http://localhost:3003/checkout.html?ref=TRX1764075...`

## Project Structure

-   `src/`: Backend source code.
    -   `routes/`: API routes (`transactionRoutes.js`, `mutasi.js`, `qrisRoutes.js`).
    -   `index.js`: Main server entry point.
-   `public/`: Frontend static files.
    -   `checkout.html`: The checkout page.
    -   `css/`: Stylesheets.
    -   `qris/`: Generated QRIS images.

## License

ISC
