"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Packages
const electron_1 = require("electron");
// import { v4 as uuid } from 'uuid';
const electron_next_1 = __importDefault(require("electron-next"));
require("./windows/load");
const windowManager_1 = __importDefault(require("./windows/windowManager"));
const tray_1 = __importDefault(require("./tray"));
// Prepare the renderer once the app is ready
electron_1.app.on("ready", async () => {
    await (0, electron_next_1.default)("./renderer");
    windowManager_1.default.noteWindow?.openNoteWindow("101");
    (0, tray_1.default)();
});
// Quit the app once all windows are closed
electron_1.app.on("window-all-closed", electron_1.app.quit);
