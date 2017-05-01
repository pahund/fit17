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

function showError() {
    dialog.showMessageBox({
        type: 'error',
        message:
        'The format of the file you have selected is invalid. ' +
        'Please select a text file that was created by exporting data from the “Monitor Your Weight” app.'
    });
}
module.exports = win => {
    const paths = dialog.showOpenDialog({properties: ['openFile']})
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
    win.webContents.send('data', data);
    createTouchBar(win);
};
