const ipcRenderer = require('electron').ipcRenderer;
const getInspirationalQuote = require('./utils/getInspirationalQuote');
ipcRenderer.on('data', (event, rawData) => getInspirationalQuote().then(quote => renderChart(rawData, quote)));

window.Highcharts = require('highcharts');
require('../vendor/technical-indicators.src');

function prepareData(rawData) {
   return rawData.map(curr => [new Date(curr.date).getTime(), parseFloat(curr.weight)]);
}

function renderChart(rawData, quote) {
    const data = prepareData(rawData);
    Highcharts.chart('container', {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Weight'
        },
        subtitle: {
            text: quote
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                millisecond: '%H:%M:%S.%L',
                second: '%H:%M:%S',
                minute: '%H:%M',
                hour: '%H:%M',
                day: '%e. %b',
                week: '%e. %b',
                month: '%b \'%y',
                year: '%Y'
            },
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'Weight (kg)'
            },
            min: 82
        },
        tooltip: {
            headerFormat: '<b>{series.name}</b><br>',
            pointFormat: '{point.x:%e. %b}: {point.y:.2f} kg'
        },

        plotOptions: {
            spline: {
                marker: {
                    enabled: true
                }
            }
        },

        series: [{
            name: 'Daily Measurements',
            data,
            id: 'primary'
        }, {
            name: 'Average (4 weeks)',
            linkedTo: 'primary',
            showInLegend: true,
            type: 'trendline',
            algorithm: 'SMA',
            periods: 28
        }, {
            name: 'Average (1 week)',
            linkedTo: 'primary',
            showInLegend: true,
            type: 'trendline',
            algorithm: 'SMA',
            periods: 7
        }, {
            name: 'Trend',
            linkedTo: 'primary',
            showInLegend: true,
            type: 'trendline',
            algorithm: 'linear'
        }]
    });
}

