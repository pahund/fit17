/**
 * getInspirationalQuote.js
 *
 * (C) 2017 mobile.de GmbH
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 30 Apr 2017
 */
const twitterFetcher = require('twitter-fetcher');

function createCallback(resolve) {
    return tweets => {
        const texts = tweets.reduce((acc, curr) => {
            const matches = curr.match(/<p class="tweet">([^<]+)<\/p>/);
            if (!matches) {
                return acc;
            }
            const line = matches[1].split('\n').map(line => line.trim()).filter(line =>
                line.length !== 0 && !line.match(/^[RM]T \S+$/)
            ).join(' ');
            if (line.match(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/)) {
                return acc;
            }
            return [...acc, line];
        }, []);
        if (texts.length === 0) {
            console.warn('failed to fetch tweets');
        }
        resolve(texts[0]);
    };
}

module.exports = () => {
    return new Promise(resolve => {
        twitterFetcher.fetch({
            profile: { screenName: 'WisdomQuotees' },
            enableLinks: false,
            showUser: false,
            showTime: false,
            showImages: false,
            lang: 'en',
            customCallback: createCallback(resolve)
        });
    });
};

