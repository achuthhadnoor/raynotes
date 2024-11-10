import { app, Menu, nativeImage, Tray } from "electron";
import windowManager from "./windows/windowManager";

let tray: Tray | null = null;

const createTray = () => {
  tray = new Tray(nativeImage.createEmpty());
  tray.setTitle("₶");
  tray.setToolTip("Snipnotes");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Open Notes",
      click: () => {
        windowManager.noteWindow?.openNoteWindow("101"); // Adjust the ID as needed
      },
    },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip("Notes App");
  tray.setContextMenu(contextMenu);
  tray.on("click", () => {
    tray?.popUpContextMenu();
  });
};

export default createTray;
