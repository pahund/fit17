/**
 * createTouchBar.js
 *
 * (C) 2017 mobile.de GmbH
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 30 Apr 2017
 */
const { TouchBar } = require('electron');
const { TouchBarLabel, TouchBarButton, TouchBarSpacer } = TouchBar;

const ICON_ACTIVE = '✔';
const ICON_INACTIVE = '𐄂';
const COLOR_ACTIVE = '#626262';
const COLOR_INACTIVE = '#373737';

class Toggle extends TouchBarButton {
    constructor(labelText, chartId, win, active = true) {
        super({
            label: `${active ? ICON_ACTIVE : ICON_INACTIVE} ${labelText}`,
            backgroundColor: active ? COLOR_ACTIVE : COLOR_INACTIVE,
            click: () => this.toggle()
        });
        this.active = true;
        this.labelText = labelText;
        this.chartId = chartId;
        this.win = win;
    }

    toggle() {
        this.active = !this.active;
        this.label = `${this.active ? ICON_ACTIVE : ICON_INACTIVE} ${this.labelText}`;
        this.backgroundColor = this.active ? COLOR_ACTIVE : COLOR_INACTIVE;
        this.win.webContents.send('toggle', {
            id: this.chartId,
            active: this.active
        });
    }
}
class Active extends TouchBarButton {
    constructor(label) {
        super({
            label: `✔ ${label}`,
            backgroundColor: '#626262'
        });
    }
}

class Inactive extends TouchBarButton {
    constructor(label) {
        super({
            label: `𐄂 ${label}`,
            backgroundColor: '#373737'
        });
    }
}

module.exports = win => new TouchBar([
    new Toggle('Daily', 'series-daily', win),
    new Toggle('Avg. 1w', 'series-avg1w', win),
    new Toggle('Avg. 4w', 'series-avg4w', win),
    new Toggle('Trend', 'series-trend', win)
]);
