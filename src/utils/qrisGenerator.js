// ===== Utility untuk CRC16-CCITT =====
function crc16ccitt(str) {
  let crc = 0xFFFF;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if (crc & 0x8000) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc <<= 1;
      }
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Generate QRIS dengan nominal
 * @param {string} qrisBase - QRIS string dari bank/ewallet
 * @param {number} nominal - nominal transaksi (contoh: 10000)
 * @returns {string} QRIS final
 */
export function generateQris(qrisBase, nominal) {
  // Hapus CRC lama (tag 63)
  let base = qrisBase.replace(/6304.{4}$/g, "");

  // Tambahkan nominal (tag 54)
  const amount = nominal.toString();
  const tag54 = `54${amount.length.toString().padStart(2, "0")}${amount}`;

  // Buat QRIS tanpa CRC
  let qrisWithoutCRC = `${base}${tag54}6304`;

  // Hitung CRC baru
  const crc = crc16ccitt(qrisWithoutCRC);

  // QRIS final valid
  return `${qrisWithoutCRC}${crc}`;
}
