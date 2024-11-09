interface ILicenseWindowManager {
  openLicenseWindow: () => void;
  closeLicenseWindow: () => void;
  verifyLicense: (license: string) => void;
  isOpen: () => boolean;
}

interface ISettingsWindowManager {
  openSettingsWindow: () => void;
  closeSettingsWindow: () => void;
}
interface INoteWindowManager {
  openNoteWindow: (id: string | number) => void;
  closeNoteWindow: () => void;
  saveNote: (note: string) => void;
  deleteNote: (id: string | number) => void;
  isOpen: () => boolean;
}
interface IAllNotesWindowManager {
  openAllNotesWindow: () => void;
  closeAllNotesWindow: () => void;
  getNotes: () => void;
  updateSettings: () => void;
  deleteAllNotes: () => void;
  deleteNote: (id: string | number) => void;
  isOpen: () => boolean;
  getSettings: () => void;
}

class WindowManager {
  licenseWindow: ILicenseWindowManager | null = null;
  settingsWindow: ISettingsWindowManager | null = null;
  noteWindow: INoteWindowManager | null = null;
  notesWindow: IAllNotesWindowManager | null = null;

  setLicenseWindow(windowManager: ILicenseWindowManager) {
    this.licenseWindow = windowManager;
  }
  setSettingsWindow(windowManager: ISettingsWindowManager) {
    this.settingsWindow = windowManager;
  }
  setNoteWindow(windowManager: INoteWindowManager) {
    this.noteWindow = windowManager;
  }
  setAllNotesWindow(windowManager: IAllNotesWindowManager) {
    this.notesWindow = windowManager;
  }
}

export default new WindowManager();
