/**
 * index.js
 *
 * (C) 2017 mobile.de GmbH
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 01 Mai 2017
 */
const express = require('express');
const sessionMiddleware = require('express-session');
const loadCredentials = require('./utils/loadCredentials');
const createClient = require('./utils/createClient');
const { BrowserWindow } = require('electron');

module.exports = () => {
    const app = express();
    app.use(sessionMiddleware({
        secret: '34kg9sh47fgh375639dnski4a'
    }));
    const loginUrl = 'http://localhost:3951/oauth-login';
    const callbackUrl = 'http://localhost:3951/oauth-callback';
    const { key, secret } = loadCredentials();
    const client = createClient(key, secret);

    app.get('/oauth-login', (req, res) =>
        client.getRequestToken(callbackUrl, (error, oauthToken, oauthTokenSecret) => {
            if (error) {
                console.error('Error getting request token', error);
                process.exit(1);
            }
            // store your token here somewhere - for this example we use req.session
            req.session.oauthToken = oauthToken;
            req.session.oauthTokenSecret = oauthTokenSecret;
            console.log('[PH_LOG] typeof callbackUrl: ', typeof callbackUrl); // PH_TODO: REMOVE
            res.redirect(client.getAuthorizeUrl(oauthToken)); // send the user to Evernote
        })
    );

    app.get('/oauth-callback', (req, res) => {
            console.log('oauth token: ', req.session.oauthToken);
            console.log('oauth token secret: ', req.session.oauthTokenSecret);
            console.log('oauth verifier: ', req.query.oauth_verifier);
            return client.getAccessToken(
                req.session.oauthToken,
                req.session.oauthTokenSecret,
                req.query.oauth_verifier,
                (error, oauthToken) => {
                    console.log('[PH_LOG] oauth callback'); // PH_TODO: REMOVE
                    if (error) {
                        console.error('Getting access token failed', error);
                        process.exit(1);
                    }
                    // oauthAccessToken is the token you need;
                    const authenticatedClient = new Evernote.Client({
                        token: oauthToken,
                        sandbox: true,
                        china: false
                    });
                    const noteStore = authenticatedClient.getNoteStore();
                    noteStore.listNotebooks().then(notebooks => {
                        console.log(notebooks); // the user's notebooks!
                    });
                });
        }
    );

    app.listen(3951, function () {
        console.log('Example app listening on port 3951');
    });

    const win = new BrowserWindow({ width: 800, height: 600, show: false });

    win.loadURL(loginUrl);

    win.once('ready-to-show', () => {
        win.show();
    });

    return win;
};
