'use strict';

const cli = require('caf_cli');
const AppActions = require('../actions/AppActions');
const urlParser = require('url');

exports.connect = function(ctx) {
    return new Promise((resolve, reject) => {
        const myURL = urlParser.parse(window.location.href);
        const userSession = 'session=user' + cli.randomString(8);
        const oldHash = myURL.hash;
        myURL.hash = myURL.hash.replace('session=user', userSession);
        /* No more than one request in the queue, keep the newest.
         *
         * Updates are not deltas, they provide the current state, and
         * it is safe to drop unprocessed requests.
         */
        const session = new cli.Session(urlParser.format(myURL), null,
                                        {maxQueueLength: 1});

        session.isUserSession = () => (myURL.hash !== oldHash);

        session.onopen = async function() {
            console.log('open session');
            try {
                resolve(await AppActions.init(ctx));
            } catch (err) {
                reject(err);
            }
        };

        session.onmessage = function(msg) {
//            console.log('message:' + JSON.stringify(msg));
            AppActions.message(ctx, msg);
        };

        session.onclose = function(err) {
            console.log('closing:' + JSON.stringify(err));
            AppActions.closing(ctx, err);
            err && reject(err); // no-op if session already opened
        };

        ctx.session = session;
    });
};
