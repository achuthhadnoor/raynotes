"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const windowManager_1 = __importDefault(require("./windows/windowManager"));
let tray = null;
const createTray = () => {
    tray = new electron_1.Tray(electron_1.nativeImage.createEmpty());
    tray.setTitle("₶");
    tray.setToolTip("Snipnotes");
    const contextMenu = electron_1.Menu.buildFromTemplate([
        {
            label: "Open Notes",
            click: () => {
                windowManager_1.default.noteWindow?.openNoteWindow("101"); // Adjust the ID as needed
            },
        },
        {
            label: "Quit",
            click: () => {
                electron_1.app.quit();
            },
        },
    ]);
    tray.setToolTip("Notes App");
    tray.setContextMenu(contextMenu);
    tray.on("click", () => {
        tray?.popUpContextMenu();
    });
};
exports.default = createTray;
