/**
 * saveConfig.js
 *
 * @author <a href="https://github.com/pahund">Patrick Hund</a>
 * @since 06 Jul 2016
 */
const configPath = require("./configPath");
const fs = require("fs");

module.exports = config => {
    try {
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    } catch (e) {
        /* can be safely ignored */
    }
};

