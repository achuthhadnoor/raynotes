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
const createBrowserWindow = (id) => {
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
        minimizable: false,
        show: false,
        maxHeight: 800,
        webPreferences: {
            nodeIntegration: true,
            allowRunningInsecureContent: true,
            preload: (0, path_1.join)(__dirname, "../preload.js"),
        },
    });
    const url = electron_is_dev_1.default
        ? `http://localhost:8000/note/${id}`
        : (0, url_1.format)({
            pathname: (0, path_1.join)(__dirname, "../../renderer/out/note.html"),
            protocol: "file:",
            slashes: true,
        });
    window.loadURL(url);
    electron_is_dev_1.default && window.webContents.openDevTools({ mode: "detach" });
    // window.setContentProtection(true);
    isOpen = true;
};
const close = () => {
    window?.close();
};
const windowOpenCheck = () => isOpen;
const saveNote = (note) => {
    window?.webContents.send("save-note", note);
};
const deleteNote = (id) => {
    window?.webContents.send("delete-note", id);
};
electron_1.ipcMain.handle("save-note", (_e, _args) => {
    return saveNote(_args.note);
});
electron_1.ipcMain.handle("delete-note", (_e, _args) => {
    return deleteNote(_args.id);
});
electron_1.ipcMain.handle("auto-height", (_e, args) => {
    console.log("====================================");
    console.log("args", args);
    console.log("====================================");
    if (window) {
        window.setSize(400, args, true);
        window.show();
    }
});
exports.default = windowManager_1.default.setNoteWindow({
    openNoteWindow: createBrowserWindow,
    closeNoteWindow: close,
    isOpen: windowOpenCheck,
    saveNote,
    deleteNote,
});
