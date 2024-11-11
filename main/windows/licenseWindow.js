"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const url_1 = require("url");
const os_1 = require("os");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const windowManager_1 = __importDefault(require("./windowManager"));
let window = null, isOpen = false;
const createBrowserWindow = () => {
    close();
    window = new electron_1.BrowserWindow({
        height: 570,
        width: 400,
        fullscreen: false,
        resizable: false,
        alwaysOnTop: true,
        frame: false,
        transparent: (0, os_1.platform)() === "darwin" ? true : false,
        vibrancy: "sidebar",
        visualEffectState: "active",
        titleBarStyle: "customButtonsOnHover",
        trafficLightPosition: { x: 14, y: 12 },
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: true,
            preload: (0, path_1.join)(__dirname, "../preload.js"),
        },
    });
    const url = electron_is_dev_1.default
        ? "http://localhost:8000/"
        : (0, url_1.format)({
            pathname: (0, path_1.join)(__dirname, "../../renderer/out/index.html"),
            protocol: "file:",
            slashes: true,
        });
    window.loadURL(url);
    electron_is_dev_1.default && window.webContents.openDevTools({ mode: "detach" });
    isOpen = true;
};
const close = () => {
    window?.close();
};
const windowOpenCheck = () => isOpen;
const verifyLicense = (license) => {
    window?.webContents.send("verify-license", license);
};
electron_1.ipcMain.handle("get-hostname", (_e, _args) => {
    return (0, os_1.hostname)();
});
exports.default = windowManager_1.default.setLicenseWindow({
    openLicenseWindow: createBrowserWindow,
    closeLicenseWindow: close,
    isOpen: windowOpenCheck,
    verifyLicense,
});
