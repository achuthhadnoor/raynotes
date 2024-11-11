"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const os_1 = require("os");
electron_1.contextBridge.exposeInMainWorld("electron", {
    ipcRenderer: {
        platform: () => (0, os_1.platform)(),
        invoke: (name, payload) => electron_1.ipcRenderer.invoke(name, payload),
        send: (name, payload) => electron_1.ipcRenderer.send(name, payload),
        on: (name, handler) => electron_1.ipcRenderer.on(name, handler),
        off: (name, handler) => electron_1.ipcRenderer.off(name, handler),
        addEventListener: (name, handler) => electron_1.ipcRenderer.addListener(name, handler),
        navigate: (link) => electron_1.shell.openExternal(link),
    },
});
