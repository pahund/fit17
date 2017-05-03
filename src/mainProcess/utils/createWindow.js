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
const loadConfig = require('../config/loadConfig');

module.exports = () => {
    let config = loadConfig();

    if (!config) {
        config = {
            width: 800,
            height: 600
        };
    }
    const win = new BrowserWindow({
        minWidth: 400,
        minHeight: 300,
        width: config.width,
        height: config.height,
        x: config.x,
        y: config.y,
        show: false
    });
    const pathname = path.join(__dirname, '../../../pages/index.html');
    win.loadURL(url.format({
        pathname,
        protocol: 'file:',
        slashes: true
    }));
    // win.webContents.openDevTools();
    win.once('ready-to-show', () => {
        if (config.path) {
            const data = readData(config.path);
            if (data) {
                win.webContents.send('chart', {
                    data,
                    daily: config.daily,
                    avg1w: config.avg1w,
                    avg4w: config.avg4w,
                    trend: config.trend
                });
            }
        }
        win.show();
        win.focus();
        if (config.fullscreen) {
            win.setFullScreen(true);
        }
    });
    return win;
};
