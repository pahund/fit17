/**
 * loadCredentials.js
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 26 Jun 2016
 */
module.exports = () => {
    let credentials;
    try {
        credentials = require("../../../../credentials.json");
    } catch (e) {
        console.error("Error: No credentials.json file found. See README.md for details.");
        process.exit(1);
    }
    if (!credentials.key) {
        console.error('Error: credentials.json file does not contain a property “key”.  See README.md for details.')
    }
    if (!credentials.secret) {
        console.error('Error: credentials.json file does not contain a property “secret”.  See README.md for details.')
    }
    return credentials;
};
