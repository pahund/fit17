/**
 * updateConfig.js
 *
 * @author <a href="https://github.com/pahund">Patrick Hund</a>
 * @since 06 Jul 2016
 */
const loadConfig = require("./loadConfig");
const saveConfig = require("./saveConfig");

module.exports = addConfig => {
    const prevConfig = loadConfig();
    let nextConfig;
    if (!prevConfig) {
        nextConfig = addConfig;
    } else {
        nextConfig = Object.assign(
            {},
            prevConfig,
            addConfig
        );
    }
    saveConfig(nextConfig);
};
