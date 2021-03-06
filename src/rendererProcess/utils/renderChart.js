/**
 * renderChart.js
 *
 * (C) 2017 mobile.de GmbH
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 30 Apr 2017
 */
window.Highcharts = require('highcharts');
require('../../vendor/technical-indicators.src');
const { ipcRenderer } = require('electron');

function prepareData(rawData) {
    return rawData.map(curr => [new Date(curr.date).getTime(), parseFloat(curr.weight)]);
}

module.exports = (chart, quote) => {
    const data = prepareData(chart.data);
    return Highcharts.chart('container', {
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
            },
            series: {
                events: {
                    legendItemClick() {
                        ipcRenderer.send('update-touch-bar', this.options.id, !this.visible);
                    }
                }
            }
        },

        series: [{
            data,
            id: 'series-primary',
            showInLegend: false,
            color: 'rgba(0,0,0,0)',
            enableMouseTracking: false
        }, {
            name: 'Daily Measurements',
            data,
            showInLegend: true,
            id: 'series-daily',
            color: '#f7d5ff',
            visible: chart.daily
        }, {
            name: 'Average (1 week)',
            id: 'series-avg1w',
            linkedTo: 'series-primary',
            showInLegend: true,
            type: 'trendline',
            algorithm: 'SMA',
            periods: 7,
            color: '#7ec2a0',
            visible: chart.avg1w
        }, {
            name: 'Average (4 weeks)',
            id: 'series-avg4w',
            linkedTo: 'series-primary',
            showInLegend: true,
            type: 'trendline',
            algorithm: 'SMA',
            periods: 28,
            color: '#b2ffd9',
            visible: chart.avg4w
        }, {
            name: 'Trend',
            id: 'series-trend',
            linkedTo: 'series-primary',
            showInLegend: true,
            type: 'trendline',
            algorithm: 'linear',
            color: '#b29866',
            visible: chart.trend
        }]
    });
};
