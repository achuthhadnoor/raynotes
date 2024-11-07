import { BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { format } from "url";
import { hostname, platform } from "os";
import electronIsDev from "electron-is-dev";
import windowManager from "./windowManager";

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
    ? "http://localhost:8000/"
    : format({
        pathname: join(__dirname, "../../renderer/out/index.html"),
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

const verifyLicense = (license: string) => {
  window?.webContents.send("verify-license", license);
};

ipcMain.handle("get-hostname", (_e, _args) => {
  return hostname();
});

export default windowManager.setLicenseWindow({
  openLicenseWindow: createBrowserWindow,
  closeLicenseWindow: close,
  isOpen: windowOpenCheck,
  verifyLicense,
});
