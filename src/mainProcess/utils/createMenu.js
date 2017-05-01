/**
 * createMenu.js
 *
 * (C) 2017 mobile.de GmbH
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 01 Mai 2017
 */
const { Menu } = require("electron");

module.exports = (app, win) => {
    const template = [{
        label: "fit17",
        submenu: [{
            label: "About fit17",
            selector: "orderFrontStandardAboutPanel:"
        }, {
            type: "separator"
        }, {
            label: "Hide fit17",
            accelerator: "Command+H",
            selector: "hide:"
        }, {
            label: "Hide Others",
            accelerator: "Command+Shift+H",
            selector: "hideOtherApplications:"
        }, {
            label: "Show All",
            selector: "unhideAllApplications:"
        }, {
            type: "separator"
        }, {
            label: "Quit",
            accelerator: "Command+Q",
            click: () => app.quit()
        }]
    }, {
        label: "File",
        submenu: [{
            label: "Open…",
            accelerator: "Command+O",
            selector: "open:",
            click: () => console.log('PH_TODO: open dialog')
        }, {
            label: "Close",
            accelerator: "Command+W",
            selector: "performClose:"
        }]
    }, {
        label: "View",
        submenu: [{
            label: "Toggle Full Screen",
            accelerator: "Ctrl+Command+F",
            click: () => win.setFullScreen(!win.isFullScreen())
        }]
    }, {
        label: "Window",
        submenu: [{
            label: "Minimize",
            accelerator: "Command+M",
            selector: "performMiniaturize:"
        }]
    }];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
};
