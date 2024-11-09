// Packages
import { app } from "electron";
import prepareNext from "electron-next";
import "./windows/load";
import windowManager from "./windows/windowManager";
import { LicenseManager } from "./services/LicenseManager";
import { TrialManager } from "./services/TrialManager";
import isDev from "electron-is-dev";

class Application {
  private licenseManager: LicenseManager;
  private trialManager: TrialManager;

  constructor() {
    this.licenseManager = new LicenseManager();
    this.trialManager = new TrialManager();
    this.initializeApp();
  }

  private initializeApp(): void {
    // Prepare the renderer once the app is ready
    app.on("ready", async () => {
      await this.handleAppStartup();
    });

    // Quit the app once all windows are closed
    app.on("window-all-closed", app.quit);
  }

  private async handleAppStartup(): Promise<void> {
    try {
      // Prepare Next.js
      await prepareNext("./renderer");

      // Check license status
      const isLicensed = await this.licenseManager.isLicenseValid();

      if (!isLicensed) {
        // Handle trial flow
        await this.handleTrialFlow();
      } else {
        // Licensed user - proceed normally
        await this.startApp();
      }
    } catch (error) {
      console.error("Startup error:", error);
      // Handle startup error (show error window, etc.)
    }
  }

  private async handleTrialFlow(): Promise<void> {
    try {
      const trialStatus = await this.trialManager.getTrialStatus();

      if (trialStatus.hasExpired) {
        // Trial expired - show activation window
        windowManager.licenseWindow?.openLicenseWindow();
      } else if (trialStatus.isActive) {
        // Trial is active - start app normally but show remaining days
        await this.startApp();
        this.showTrialBanner(trialStatus.daysRemaining);
      } else {
        // No trial started yet - start trial and proceed
        await this.trialManager.startTrial();
        await this.startApp();
        this.showTrialBanner(this.trialManager.getTrialDuration());
      }

      // Set up periodic trial checks
      if (!isDev) {
        this.setupTrialChecks();
      }
    } catch (error) {
      console.error("Trial flow error:", error);
      windowManager.licenseWindow?.openLicenseWindow();
    }
  }

  private async startApp(): Promise<void> {
    // Initialize your app windows and features
    windowManager.noteWindow?.openNoteWindow("101");
  }

  private showTrialBanner(_daysRemaining: number): void {
    // Implement trial banner/notification logic
    // windowManager.noteWindow?.webContents.send("trial-status-update", {
    //   daysRemaining,
    //   isTrialVersion: true,
    // });
  }

  private setupTrialChecks(): void {
    // Check trial status periodically (e.g., daily)
    setInterval(async () => {
      const status = await this.trialManager.getTrialStatus();

      if (status.hasExpired) {
        windowManager.licenseWindow?.openLicenseWindow();
      } else {
        this.showTrialBanner(status.daysRemaining);
      }
    }, 24 * 60 * 60 * 1000); // Daily check
  }
}

// Initialize the application
new Application();
