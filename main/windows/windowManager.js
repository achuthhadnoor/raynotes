"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class WindowManager {
    licenseWindow = null;
    settingsWindow = null;
    noteWindow = null;
    notesWindow = null;
    setLicenseWindow(windowManager) {
        this.licenseWindow = windowManager;
    }
    setSettingsWindow(windowManager) {
        this.settingsWindow = windowManager;
    }
    setNoteWindow(windowManager) {
        this.noteWindow = windowManager;
    }
    setAllNotesWindow(windowManager) {
        this.notesWindow = windowManager;
    }
}
exports.default = new WindowManager();
