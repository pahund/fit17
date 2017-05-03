/**
 * openFile.js
 *
 * (C) 2017 mobile.de GmbH
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 01 Mai 2017
 */
const { dialog } = require("electron");
const readData = require('./readData');
const isBinaryFile = require('isbinaryfile');
const createTouchBar = require('./createTouchBar');
const loadConfig = require('../config/loadConfig');
const updateConfig = require('../config/updateConfig');

function showError() {
    dialog.showMessageBox({
        type: 'error',
        message:
        'The format of the file you have selected is invalid. ' +
        'Please select a text file that was created by exporting data from the “Monitor Your Weight” app.'
    });
}
module.exports = win => {
    const paths = dialog.showOpenDialog({properties: ['openFile']});
    if (!paths) {
        return;
    }
    const path = paths[0];
    if (isBinaryFile.sync(path)) {
        showError();
        return;
    }
    const data = readData(path);
    if (!data) {
        showError();
        return;
    }
    let daily = true;
    let avg1w = true;
    let avg4w = true;
    let trend = true;
    const config = loadConfig();
    if (config) {
        ({ daily, avg1w, avg4w, trend } = config);
    }
    win.webContents.send('chart', {
        data,
        daily,
        avg1w,
        avg4w,
        trend
    });
    updateConfig({ path });
    createTouchBar(win);
};
