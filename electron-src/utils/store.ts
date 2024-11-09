import { app } from "electron";
import * as path from "path";
import * as fs from "fs";
import { encrypt, decrypt } from "./crypto"; // We'll create this next

export interface StoreData {
  license?: {
    key: string;
    activatedAt: string;
  };
  trial?: {
    startDate: string;
    endDate: string;
    isStarted: boolean;
  };
  [key: string]: any;
}

export class Store {
  private path: string;
  private data: { [key: string]: any };

  constructor() {
    // Get user data path for the app
    const userDataPath = app.getPath("userData");
    this.path = path.join(userDataPath, "storage.enc"); // Encrypted storage file
    this.data = this.loadData();
  }

  /**
   * Get a value from store
   */
  public get(key: string): any {
    return this.data[key];
  }

  /**
   * Set a value in store
   */
  public set(key: string, value: any): void {
    this.data[key] = value;
    this.saveData();
  }

  /**
   * Delete a value from store
   */
  public delete(key: string): void {
    delete this.data[key];
    this.saveData();
  }

  /**
   * Clear all data from store
   */
  public clear(): void {
    this.data = {};
    this.saveData();
  }

  /**
   * Load data from storage file
   */
  private loadData(): { [key: string]: any } {
    try {
      if (fs.existsSync(this.path)) {
        const encryptedData = fs.readFileSync(this.path, "utf8");
        const decryptedData = decrypt(encryptedData);
        return JSON.parse(decryptedData);
      }
      return {};
    } catch (error) {
      console.error("Failed to load data:", error);
      return {};
    }
  }

  /**
   * Save data to storage file
   */
  private saveData(): void {
    try {
      const jsonData = JSON.stringify(this.data);
      const encryptedData = encrypt(jsonData);
      fs.writeFileSync(this.path, encryptedData);
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  }
}
