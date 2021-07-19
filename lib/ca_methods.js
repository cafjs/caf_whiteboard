'use strict';

const assert = require('assert');
const caf = require('caf_core');
const USERS_SESSION = /^user/;
const APP_SESSION = 'default';
const boardUtil = require('./ca_methods_util');


const notifyWebApp = function(self, msg) {
    self.$.session.notify([msg], APP_SESSION, boardUtil.patchTextF);
    self.$.session.notify([msg], USERS_SESSION, boardUtil.patchTextF);
};

exports.methods = {
    // Methods called by framework
    async __ca_init__() {
        this.$.session.limitQueue(1, APP_SESSION); // only the last notification
        this.state.epoch = 1;
        this.state.dark = true;
        this.state.elements = [];
        this.state.sourceId = null;
        this.state.fullName = this.__ca_getAppName__() + '#' +
            this.__ca_getName__();
        return [];
    },

    //External methods

    async hello(key) {
        return this.getState();
    },

    // Example external method
    async reset() {
        this.state.epoch = this.state.epoch + 1;
        this.state.elements = [];
        this.state.sourceId = null;
        notifyWebApp(this, this.state);
        return this.getState();
    },

    async setDark(dark) {
        assert(typeof dark === 'boolean');
        this.state.dark = dark;
        notifyWebApp(this, this.state);
        return this.getState();
    },

    async updateElements(epoch, sourceId, elements) {
        if (epoch === this.state.epoch) {
            const sessionId = this.$.session.getSessionId();
            this.state.elements = boardUtil.unpatchTextF(sessionId, elements);
            this.state.sourceId = sourceId;
            notifyWebApp(this, this.state);
        } else {
            this.$.log && this.$.log.debug(`Ignoring update: epoch ${epoch}`);
        }
        return [];
    },

    async getState() {
        const sessionId = this.$.session.getSessionId();
        const elements = boardUtil.patchTextF(sessionId, this.state.elements);
        return [null, {...this.state, ...{elements}}];
    }
};

caf.init(module);
