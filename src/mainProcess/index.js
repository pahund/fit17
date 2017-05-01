const createWindow = require('./utils/createWindow');
const createMenu = require('./utils/createMenu');
const createTouchBar = require('./utils/createTouchBar');

const { app } = require('electron');
const path = require('path');

app.on('ready', () => {
    const win = createWindow();
    win.on('closed', () => app.quit());
    createMenu(app, win);
});

