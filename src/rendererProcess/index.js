const ipcRenderer = require('electron').ipcRenderer;
const getInspirationalQuote = require('./utils/getInspirationalQuote');
const renderChart = require('./utils/renderChart');

ipcRenderer.on('data', async (event, rawData) => {
    const quote = await getInspirationalQuote();
    renderChart(rawData, quote);
});

