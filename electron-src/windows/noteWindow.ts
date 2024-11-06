import { BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { format } from "url";
import electronIsDev from "electron-is-dev";
import windowManager from "./windowManager";
import { platform } from "os";

let window: BrowserWindow | null = null,
  isOpen = false;

const createBrowserWindow = (id: string) => {
  close();
  window = new BrowserWindow({
    height: 570,
    width: 400,
    fullscreen: false,
    resizable: false,
    frame: false,
    transparent: platform() === "darwin" ? true : false,
    vibrancy: "sidebar",
    titleBarStyle: "customButtonsOnHover",
    trafficLightPosition: { x: 16, y: 16 },
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: true,
      preload: join(__dirname, "../preload.js"),
    },
  });

  const url = electronIsDev
    ? `http://localhost:8000/note?id=${id}`
    : format({
        pathname: join(__dirname, "../../renderer/out/note.html"),
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

const windowOpenCheck = () => isOpen;

const saveNote = (note: string) => {
  window?.webContents.send("save-note", note);
};

const deleteNote = (id: string) => {
  window?.webContents.send("delete-note", id);
};

ipcMain.handle("save-note", (_e, _args) => {
  return saveNote(_args.note);
});

ipcMain.handle("delete-note", (_e, _args) => {
  return deleteNote(_args.id);
});

export default windowManager.setNoteWindow({
  openNoteWindow: createBrowserWindow,
  closeNoteWindow: close,
  isOpen: windowOpenCheck,
  saveNote,
  deleteNote,
});
