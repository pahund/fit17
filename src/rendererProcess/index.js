const ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('data', function (event, data) {
    console.log(data);
});

