const ipcRenderer = require('electron').ipcRenderer;
ipcRenderer.on('data', function (event, rawData) {
    renderChart(rawData);
});

const Highcharts = require('highcharts');
const { fitData } = require('./utils/regression');

function renderChart(rawData) {
    const data = rawData.map(curr => [new Date(curr.date).getTime(), parseFloat(curr.weight)]);
    Highcharts.chart('container', {
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Weight 2017'
        },
        subtitle: {
            text: 'You can do it!'
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
            data
        }, {
            name: 'Trend',
            type: 'line',
            marker: { enabled: false },
            data: (function() {
                return fitData(data).data;
            })()
        }]
    });
}

