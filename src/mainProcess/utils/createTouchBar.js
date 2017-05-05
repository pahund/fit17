/**
 * createTouchBar.js
 *
 * (C) 2017 mobile.de GmbH
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 30 Apr 2017
 */
const { TouchBar, ipcMain } = require('electron');
const { TouchBarButton } = TouchBar;
const loadConfig = require('../config/loadConfig');
const updateConfig = require('../config/updateConfig');

const ICON_ACTIVE = '✔';
const ICON_INACTIVE = '𐄂';
const COLOR_ACTIVE = '#626262';
const COLOR_INACTIVE = '#373737';

const ACTIVE = Symbol('private property “active”');

class Toggle extends TouchBarButton {
    constructor(labelText, chartId, win, active = true) {
        super({
            label: `${active ? ICON_ACTIVE : ICON_INACTIVE} ${labelText}`,
            backgroundColor: active ? COLOR_ACTIVE : COLOR_INACTIVE,
            click: () => this.toggle()
        });
        this[ACTIVE] = active;
        this.labelText = labelText;
        this.chartId = chartId;
        this.configId = chartId.substr(chartId.indexOf('-') + 1);
        this.win = win;
    }

    toggle() {
        this.active = !this[ACTIVE];
    }

    set active(nextActive) {
        this[ACTIVE] = nextActive;
        this.label = `${this.active ? ICON_ACTIVE : ICON_INACTIVE} ${this.labelText}`;
        this.backgroundColor = this.active ? COLOR_ACTIVE : COLOR_INACTIVE;
        this.win.webContents.send('toggle', {
            id: this.chartId,
            active: this.active
        });
        updateConfig({ [this.configId]: this.active });
    }

    get active() {
        return this[ACTIVE];
    }
}

module.exports = win => {
    let daily = true;
    let avg1w = true;
    let avg4w = true;
    let trend = true;
    const config = loadConfig();
    if (config) {
        ({ daily, avg1w, avg4w, trend } = config);
    }

    const buttons = {
        'series-daily': new Toggle('Daily', 'series-daily', win, daily),
        'series-avg1w': new Toggle('Avg. 1w', 'series-avg1w', win, avg1w),
        'series-avg4w': new Toggle('Avg. 4w', 'series-avg4w', win, avg4w),
        'series-trend': new Toggle('Trend', 'series-trend', win, trend)
    };

    win.setTouchBar(new TouchBar(Object.keys(buttons).map(id => buttons[id])));
    ipcMain.on('update-touch-bar', (event, id, visible) => buttons[id].active = visible);
};
