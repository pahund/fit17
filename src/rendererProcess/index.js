const ipcRenderer = require('electron').ipcRenderer;
const getInspirationalQuote = require('./utils/getInspirationalQuote');
const renderChart = require('./utils/renderChart');

let chart;

ipcRenderer.on('data', async (event, rawData) => {
    const quote = await getInspirationalQuote();
    chart = renderChart(rawData, quote);
});

ipcRenderer.on('toggle', (event, { id, active }) => {
    if (active) {
        chart.get(id).show();
    } else {
        chart.get(id).hide();
    }
});
