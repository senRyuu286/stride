

import pako from "pako";
import QRCode from "qrcode";
import jsQR from "jsqr";
import {
  parseAndValidateBackup,
  type StrideBackupPayload,
  type ValidationResult,
} from "./backupRestore";

const QR_PREFIX = "STRIDE_V1:";

export function encodePayloadForQR(payload: StrideBackupPayload): string {
  const json = JSON.stringify(payload);
  const compressed = pako.deflate(json);

const binary = Array.from(compressed)
    .map((b) => String.fromCharCode(b))
    .join("");
  const base64 = btoa(binary);

  return QR_PREFIX + base64;
}

export async function renderQRToCanvas(
  canvas: HTMLCanvasElement,
  payload: StrideBackupPayload,
): Promise<void> {
  const data = encodePayloadForQR(payload);

  try {
    await QRCode.toCanvas(canvas, data, {
      errorCorrectionLevel: "M", 
      margin: 2,
      width: 280,
      color: {
        
        dark: "#000000",
        light: "#ffffff",
      },
    });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown error generating QR code.";

if (message.toLowerCase().includes("too big")) {
      throw new Error(
        "Your data is too large to fit in a single QR code. Use the JSON export instead.",
      );
    }
    throw new Error(`QR generation failed: ${message}`);
  }
}

export function decodeQRFromImageData(
  imageData: ImageData,
): ValidationResult | null {
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "dontInvert",
  });

  if (!code) return null;

  const raw = code.data;

  if (!raw.startsWith(QR_PREFIX)) {
    return {
      ok: false,
      error: "QR code is not a Stride backup. Make sure you scan the correct code.",
    };
  }

  const base64 = raw.slice(QR_PREFIX.length);

  try {
    
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    const decompressed = pako.inflate(bytes, { to: "string" });
    return parseAndValidateBackup(decompressed);
  } catch {
    return {
      ok: false,
      error: "Failed to decode QR code data. The code may be corrupted.",
    };
  }
}