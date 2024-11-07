import { BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { format } from "url";
import electronIsDev from "electron-is-dev";
import windowManager from "./windowManager";
import { platform } from "os";

let window: BrowserWindow | null = null,
  isOpen = false;

const createBrowserWindow = () => {
  close();
  window = new BrowserWindow({
    height: 570,
    width: 400,
    fullscreen: false,
    resizable: false,
    alwaysOnTop: true,
    frame: false,
    transparent: platform() === "darwin" ? true : false,
    vibrancy: "sidebar",
    visualEffectState: "active",
    titleBarStyle: "customButtonsOnHover",
    trafficLightPosition: { x: 14, y: 12 },
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: true,
      preload: join(__dirname, "../preload.js"),
    },
  });

  const url = electronIsDev
    ? `http://localhost:8000/notes`
    : format({
        pathname: join(__dirname, "../../renderer/out/notes.html"),
        protocol: "file:",
        slashes: true,
      });

  window.loadURL(url);
  electronIsDev && window.webContents.openDevTools({ mode: "detach" });
  isOpen = true;
};

const close = () => {
  window?.close();
};

const deleteNote = (id: string) => {
  window?.webContents.send("delete-all-note", { id });
};

const windowOpenCheck = () => isOpen;

const getNotes = () => {
  window?.webContents.send("get-notes");
};

const updateSettings = () => {
  window?.webContents.send("update-settings");
};

const deleteAllNotes = () => {
  window?.webContents.send("delete-all-notes");
};

const getSettings = () => {
  window?.webContents.send("get-settings");
};

ipcMain.handle("delete-all-note", (_e, _args) => {
  deleteNote(_args.id);
});

ipcMain.handle("get-notes", (_e, _args) => {
  getNotes();
});

ipcMain.handle("update-settings", (_e, _args) => {
  updateSettings();
});

ipcMain.handle("delete-all-notes", (_e, _args) => {
  deleteAllNotes();
});

ipcMain.handle("get-settings", (_e, _args) => {
  return getSettings();
});

export default windowManager.setAllNotesWindow({
  openAllNotesWindow: createBrowserWindow,
  closeAllNotesWindow: close,
  getNotes,
  deleteAllNotes,
  deleteNote,
  isOpen: windowOpenCheck,
  getSettings,
  updateSettings,
});
