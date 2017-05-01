/**
 * createClient.js
 *
 * (C) 2017 mobile.de GmbH
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 01 Mai 2017
 */
const Evernote = require('evernote');

module.exports = (key, secret) => new Evernote.Client({
    consumerKey: key,
    consumerSecret: secret,
    sandbox: true, // change to false when you are ready to switch to production
    china: false // change to true if you wish to connect to YXBJ - most of you won't
});
