const createWindow = require('./utils/createWindow');
const createMenu = require('./utils/createMenu');
const createTouchBar = require('./utils/createTouchBar');
const updateConfig = require('./config/updateConfig');

const { app } = require('electron');
const path = require('path');

app.on('ready', () => {
    const win = createWindow();
    win.on('close', () => {
        const { x, y, width, height } = win.getBounds();
        const fullscreen = win.isFullScreen();
        updateConfig({ x, y, width, height, fullscreen });
    });
    win.on("closed", () => {
        app.quit();
    });
    createMenu(app, win);
    createTouchBar(win);
});

