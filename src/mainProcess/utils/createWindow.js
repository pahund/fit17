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
const readData = require('./readData');
const url = require('url');

module.exports = () => {
    const win = new BrowserWindow({ width: 800, height: 600, show: false });
    const pathname = path.join(__dirname, '../../../pages/index.html');
    win.loadURL(url.format({
        pathname,
        protocol: 'file:',
        slashes: true
    }));
    // win.webContents.openDevTools();
    win.once('ready-to-show', () => win.show());
    return win;
};
