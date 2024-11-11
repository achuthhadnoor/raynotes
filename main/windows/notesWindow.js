"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = require("path");
const url_1 = require("url");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const windowManager_1 = __importDefault(require("./windowManager"));
const os_1 = require("os");
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
        ? `http://localhost:8000/notes`
        : (0, url_1.format)({
            pathname: (0, path_1.join)(__dirname, "../../renderer/out/notes.html"),
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
const deleteNote = (id) => {
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
electron_1.ipcMain.handle("delete-all-note", (_e, _args) => {
    deleteNote(_args.id);
});
electron_1.ipcMain.handle("get-notes", (_e, _args) => {
    getNotes();
});
electron_1.ipcMain.handle("update-settings", (_e, _args) => {
    updateSettings();
});
electron_1.ipcMain.handle("delete-all-notes", (_e, _args) => {
    deleteAllNotes();
});
electron_1.ipcMain.handle("get-settings", (_e, _args) => {
    return getSettings();
});
exports.default = windowManager_1.default.setAllNotesWindow({
    openAllNotesWindow: createBrowserWindow,
    closeAllNotesWindow: close,
    getNotes,
    deleteAllNotes,
    deleteNote,
    isOpen: windowOpenCheck,
    getSettings,
    updateSettings,
});
