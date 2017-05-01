/**
 * createWindow.js
 *
 * (C) 2017 mobile.de GmbH
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 01 Mai 2017
 */
const path = require('path');
const { BrowserWindow } = require('electron');
const createTouchBar = require('./createTouchBar');
const readData = require('./readData');
const url = require('url');

module.exports = () => {
    const data = readData(path.join(__dirname, '../../../data.txt'));

    // Create the browser window.
    const win = new BrowserWindow({ width: 800, height: 600, show: false });

    // and load the index.html of the app.
    const pathname = path.join(__dirname, '../../../pages/index.html');
    win.loadURL(url.format({
        pathname,
        protocol: 'file:',
        slashes: true
    }));

    // Open the DevTools.
    win.webContents.openDevTools();

    win.setTouchBar(createTouchBar(win));

    win.once('ready-to-show', () => {
        win.webContents.send('data', data);
        win.show();
    });

    return win;
};
