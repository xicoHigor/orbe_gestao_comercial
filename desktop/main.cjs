const { app, BrowserWindow, dialog, shell } = require('electron');
const { once } = require('node:events');
const fs = require('node:fs');
const path = require('node:path');

app.setAppUserModelId('br.com.orbe.gestaocomercial');
app.setPath('userData', path.join(app.getPath('appData'), 'Orbe Comercial'));

const hasSingleInstance = app.requestSingleInstanceLock();
if (!hasSingleInstance) app.quit();

let mainWindow = null;
let backendServer = null;
let database = null;
let appOrigin = null;

if (hasSingleInstance) {
  app.on('second-instance', () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  });

  async function createMainWindow() {
    const userData = app.getPath('userData');
    fs.mkdirSync(userData, { recursive: true });

    process.env.NODE_ENV = 'production';
    process.env.HOST = '127.0.0.1';
    process.env.PORT = '0';
    process.env.DATABASE_PATH = path.join(userData, 'comercial.sqlite');
    process.env.DOTENV_CONFIG_PATH = path.join(userData, '.env');

    const backend = await import('../server/index.js');
    backendServer = backend.server;
    database = backend.db;
    if (!backendServer) throw new Error('O servidor local não foi iniciado.');
    if (!backendServer.listening) await once(backendServer, 'listening');

    const address = backendServer.address();
    appOrigin = 'http://127.0.0.1:' + address.port;
    process.env.APP_URL = process.env.APP_URL || appOrigin;

    mainWindow = new BrowserWindow({
      width: 1440, height: 940, minWidth: 900, minHeight: 650,
      show: false, autoHideMenuBar: true, backgroundColor: '#f7f8fc',
      webPreferences: { contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true },
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      try {
        const target = new URL(url);
        if (target.protocol === 'https:' && target.hostname === 'wa.me') void shell.openExternal(target.href);
      } catch {}
      return { action: 'deny' };
    });
    mainWindow.webContents.on('will-navigate', (event, url) => {
      if (!url.startsWith(appOrigin)) event.preventDefault();
    });
    mainWindow.once('ready-to-show', () => mainWindow.show());
    mainWindow.on('closed', () => { mainWindow = null; });
    await mainWindow.loadURL(appOrigin);
  }

  app.whenReady().then(createMainWindow).catch((error) => {
    dialog.showErrorBox('Não foi possível iniciar o Orbe Comercial', error?.stack || String(error));
    app.quit();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow().catch((error) => {
      dialog.showErrorBox('Não foi possível abrir o Orbe Comercial', error?.stack || String(error));
    });
  });

  app.on('before-quit', () => {
    if (backendServer?.listening) backendServer.close();
    if (database?.isOpen) database.close();
  });
}
