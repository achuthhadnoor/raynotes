import * as crypto from "crypto";

// In production, use proper key management
const ENCRYPTION_KEY =
  process.env.ENCRYPTION_KEY || "your-secret-key-min-32-chars-long!!";
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;

/**
 * Encrypt data
 */
export function encrypt(text: string): string {
  try {
    // Generate salt and get key
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = crypto.scryptSync(ENCRYPTION_KEY, salt, 32);

    // Create cipher
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    // Encrypt the data
    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Get auth tag
    const tag = cipher.getAuthTag();

    // Combine all parts: salt + iv + tag + encrypted data
    const result = Buffer.concat([
      salt,
      iv,
      tag,
      Buffer.from(encrypted, "hex"),
    ]);

    return result.toString("base64");
  } catch (error) {
    console.error("Encryption failed:", error);
    throw new Error("Encryption failed");
  }
}

/**
 * Decrypt data
 */
export function decrypt(encryptedData: string): string {
  try {
    // Convert from base64 and split parts
    const buffer = Buffer.from(encryptedData, "base64");

    const salt = buffer.subarray(0, SALT_LENGTH);
    const iv = buffer.subarray(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const tag = buffer.subarray(
      SALT_LENGTH + IV_LENGTH,
      SALT_LENGTH + IV_LENGTH + TAG_LENGTH
    );
    const encrypted = buffer.subarray(SALT_LENGTH + IV_LENGTH + TAG_LENGTH);

    // Get key
    const key = crypto.scryptSync(ENCRYPTION_KEY, salt, 32);

    // Create decipher
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    // Decrypt the data
    let decrypted = decipher.update(encrypted.toString("hex"), "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw new Error("Decryption failed");
  }
}
