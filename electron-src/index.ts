// Packages
import { app } from "electron";
// import { v4 as uuid } from 'uuid';
import prepareNext from "electron-next";
import "./windows/load";
import windowManager from "./windows/windowManager";

// Prepare the renderer once the app is ready
app.on("ready", async () => {
  await prepareNext("./renderer");
  windowManager.noteWindow?.openNoteWindow("101");
});

// Quit the app once all windows are closed
app.on("window-all-closed", app.quit);
