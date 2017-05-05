/**
 * index.js
 *
 * (C) 2017 mobile.de GmbH
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 05 Mai 2017
 */

const packager = require('electron-packager');
const path = require('path');

const options = {
    dir: path.resolve(__dirname, '../..'),
    out: path.resolve(__dirname, '../../dist'),
    overwrite: true,
    appCopyright: 'Copyright © 2017 Patrick Hund'
};

packager(options, (err, appPaths) => {
    if (err) {
        console.error('Build failed!', err);
        process.exit(1);
    }
    console.log('Build successful!', appPaths);
});

