'use strict';

const assert = require('assert');
const caf = require('caf_core');
const USERS_SESSION = /^user/;
const APP_SESSION = 'default';

const notifyWebApp = function(self, msg) {
    self.$.session.notify([msg], APP_SESSION);
    self.$.session.notify([msg], USERS_SESSION);
};

exports.methods = {
    // Methods called by framework
    async __ca_init__() {
        this.$.session.limitQueue(1, APP_SESSION); // only the last notification
        this.state.epoch = 1;
        this.state.dark = true;
        this.state.elements = [];
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
        notifyWebApp(this, this.state);
        return this.getState();
    },

    async setDark(dark) {
        assert(typeof dark === 'boolean');
        this.state.dark = dark;
        notifyWebApp(this, this.state);
        return this.getState();
    },

    async updateElements(epoch, elements) {
        if (epoch === this.state.epoch) {
            this.state.elements = elements;
            notifyWebApp(this, this.state);
        } else {
            this.$.log && this.$.log.debug(`Ignoring update: epoch ${epoch}`);
        }
        return this.getState();
    },

    async getState() {
        return [null, this.state];
    }
};

caf.init(module);
