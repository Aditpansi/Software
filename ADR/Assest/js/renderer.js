// Renderer process script for Electron
// This file is loaded in the renderer process and provides secure communication

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Add any APIs you need to communicate with main process
  platform: process.platform,
  versions: process.versions
});

// Prevent context menu (right-click menu) in production
document.addEventListener('contextmenu', (e) => {
  if (!process.argv.includes('--dev')) {
    e.preventDefault();
  }
});

// Prevent drag and drop of files
document.addEventListener('dragover', (e) => {
  e.preventDefault();
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
});

// Prevent navigation away from the app
window.addEventListener('beforeunload', (e) => {
  e.preventDefault();
  e.returnValue = '';
});r