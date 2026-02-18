import QRCode from "qrcode";

export async function toDataURL(text, options = {}) {
  try {
    const dataUrl = await QRCode.toDataURL(String(text || ""), {
      type: "image/png",
      width: 300,
      margin: 1,
      errorCorrectionLevel: "M",
      ...options,
    });
    return dataUrl; // data:image/png;base64,....
  } catch (err) {
    throw new Error(`QR generation failed: ${err.message}`);
  }
}
