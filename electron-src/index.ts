// Packages
import { app } from "electron";
import prepareNext from "electron-next";
import "./windows/load";
import windowManager from "./windows/windowManager";

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");
  windowManager.licenseWindow?.openLicenseWindow();
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);
