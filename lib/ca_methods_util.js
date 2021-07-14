'use strict';

const SESSION_REGEX = /\$\{SESSION\}/g; // ${SESSION} -> sessionID

const escapeRegexp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.patchTextF = function(sessionId, argsArray) {
    const str = JSON.stringify(argsArray);
    return JSON.parse(str.replace(SESSION_REGEX, sessionId));
};

exports.unpatchTextF = function(sessionId, argsArray) {
    const regExp = new RegExp(escapeRegexp(sessionId), 'g');
    const str = JSON.stringify(argsArray);
    return JSON.parse(str.replace(regExp, '${SESSION}'));

};
