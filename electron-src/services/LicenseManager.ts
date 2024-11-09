import { ipcMain } from "electron";
import { DatabaseManager } from "../utils/database";
import Database from "better-sqlite3";

interface License {
  key: string;
  activated_at: string;
  expires_at?: string;
  is_active: boolean;
}

export class LicenseManager {
  private db: Database.Database;

  constructor() {
    this.db = DatabaseManager.getInstance();
    this.setupIpcHandlers();
  }

  private setupIpcHandlers(): void {
    ipcMain.handle("license-verify-key", async (_, key: string) => {
      return await this.verifyLicense(key);
    });

    ipcMain.handle("license-save-key", async (_, key: string) => {
      return await this.saveLicense(key);
    });
  }

  public async isLicenseValid(): Promise<boolean> {
    try {
      const stmt = this.db.prepare(`
        SELECT * FROM licenses 
        WHERE is_active = 1 
        AND (expires_at IS NULL OR expires_at > datetime('now'))
        ORDER BY created_at DESC 
        LIMIT 1
      `);

      const license = stmt.get() as License | undefined;

      if (!license) return false;

      return await this.verifyLicense(license.key);
    } catch (error) {
      console.error("License validation error:", error);
      return false;
    }
  }

  private async verifyLicense(_key: string): Promise<boolean> {
    // Implement your license verification logic here
    // This should make an API call to your license server
    return true; // Placeholder
  }

  private async saveLicense(key: string): Promise<void> {
    const stmt = this.db.prepare(`
      INSERT INTO licenses (key, activated_at) 
      VALUES (?, datetime('now'))
      ON CONFLICT(key) 
      DO UPDATE SET 
        activated_at = datetime('now'),
        is_active = 1
    `);

    stmt.run(key);
  }
}
