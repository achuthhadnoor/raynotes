import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";
import { migrate } from "./migration";

export interface License {
  id: number;
  key: string;
  activated_at: string;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

export interface Trial {
  id: number;
  start_date: string;
  end_date: string;
  is_started: boolean;
  extensions_used: number;
  created_at: string;
}

export class DatabaseManager {
  private static instance: Database.Database;

  public static getInstance(): Database.Database {
    if (!DatabaseManager.instance) {
      const dbPath = path.join(app.getPath("userData"), "app.db");
      DatabaseManager.instance = new Database(dbPath, {
        verbose: console.log, // Remove in production
      });

      // Enable foreign keys
      DatabaseManager.instance.pragma("foreign_keys = ON");

      // Initialize database
      this.initDatabase();
    }

    return DatabaseManager.instance;
  }

  private static initDatabase(): void {
    const db = DatabaseManager.instance;

    // Create tables if they don't exist
    db.exec(`
      CREATE TABLE IF NOT EXISTS licenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        activated_at TEXT NOT NULL,
        expires_at TEXT,
        is_active BOOLEAN DEFAULT 1,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS trials (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        start_date TEXT NOT NULL,
        end_date TEXT NOT NULL,
        is_started BOOLEAN DEFAULT 1,
        extensions_used INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Run any pending migrations
    migrate(db);
  }
}
