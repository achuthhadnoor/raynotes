import { ipcMain } from "electron";
import { DatabaseManager } from "../utils/database";
import Database from "better-sqlite3";

interface TrialStatus {
  isActive: boolean;
  hasExpired: boolean;
  daysRemaining: number;
  startDate?: string;
  endDate?: string;
}

export class TrialManager {
  private db: Database.Database;
  private readonly TRIAL_DURATION_DAYS = 14;

  constructor() {
    this.db = DatabaseManager.getInstance();
    this.setupIpcHandlers();
  }

  private setupIpcHandlers(): void {
    ipcMain.handle("trial-start", async () => {
      return await this.startTrial();
    });

    ipcMain.handle("trial-get-status", async () => {
      return await this.getTrialStatus();
    });
  }

  public getTrialDuration(): number {
    return this.TRIAL_DURATION_DAYS;
  }

  public async startTrial(): Promise<TrialStatus> {
    const stmt = this.db.prepare(`
      INSERT INTO trials (start_date, end_date, is_started)
      VALUES (
        datetime('now'),
        datetime('now', '+${this.TRIAL_DURATION_DAYS} days'),
        1
      )
    `);

    stmt.run();
    return this.getTrialStatus();
  }

  public async getTrialStatus(): Promise<TrialStatus> {
    const stmt = this.db.prepare(`
      SELECT 
        start_date,
        end_date,
        is_started,
        CASE 
          WHEN end_date > datetime('now') THEN 
            CAST(
              (julianday(end_date) - julianday('now')) AS INTEGER
            )
          ELSE 0
        END as days_remaining
      FROM trials
      ORDER BY created_at DESC
      LIMIT 1
    `);

    const trial = stmt.get() as any;

    if (!trial) {
      return {
        isActive: false,
        hasExpired: false,
        daysRemaining: this.TRIAL_DURATION_DAYS,
      };
    }

    return {
      isActive: trial.is_started === 1,
      hasExpired: trial.days_remaining <= 0,
      daysRemaining: trial.days_remaining,
      startDate: trial.start_date,
      endDate: trial.end_date,
    };
  }

  public async extendTrial(days: number): Promise<TrialStatus> {
    const stmt = this.db.prepare(`
      UPDATE trials 
      SET end_date = datetime(end_date, '+${days} days'),
          extensions_used = extensions_used + 1
      WHERE id = (
        SELECT id FROM trials 
        ORDER BY created_at DESC 
        LIMIT 1
      )
      AND extensions_used < 1
    `);

    const result = stmt.run();

    if (result.changes === 0) {
      throw new Error("Trial extension not allowed");
    }

    return this.getTrialStatus();
  }
}
