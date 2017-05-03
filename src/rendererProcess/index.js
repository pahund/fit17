const ipcRenderer = require('electron').ipcRenderer;
const getInspirationalQuote = require('./utils/getInspirationalQuote');
const renderChart = require('./utils/renderChart');

let chart;

const splashTimeout = setTimeout(() => {
    const container = document.getElementById('container');
    container.innerHTML = `
        <div class="splash">
            <p>
                To get started, use <em>File → Open…</em> to load a file<br>
                with weight data exported from the “Monitor Your Weight” app.
            </p>
        </div>
    `;
}, 1000);

ipcRenderer.on('chart', async (event, chartData) => {
    clearTimeout(splashTimeout);
    const quote = await getInspirationalQuote();
    chart = renderChart(chartData, quote);
});

ipcRenderer.on('toggle', (event, { id, active }) => {
    if (active) {
        chart.get(id).show();
    } else {
        chart.get(id).hide();
    }
});
