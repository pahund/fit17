/**
 * getConfigPath.js
 *
 * @author <a href="https://github.com/pahund">Patrick Hund</a>
 * @since 06 Jul 2016
 */
const path = require("path");
const os = require("os");

module.exports = path.join(os.homedir(), ".fit17");

