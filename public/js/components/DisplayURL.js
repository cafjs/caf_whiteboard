'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const AppActions = require('../actions/AppActions');
const urlParser = require('url');

class DisplayURL extends React.Component {

    constructor(props) {
        super(props);
        this.doDismissURL = this.doDismissURL.bind(this);
        this.doCopyURL = this.doCopyURL.bind(this);
        this.doEmail = this.doEmail.bind(this);
        this.doStandalone = this.doStandalone.bind(this);

        if ((typeof window !== "undefined") &&
            window.location && window.location.href) {
            const myURL = urlParser.parse(window.location.href);
            myURL.hash = myURL.hash.replace('session=default', 'session=user');
            delete myURL.search; // delete cacheKey
            this.userURL = urlParser.format(myURL);
        }
    }

    doDismissURL(ev) {
        AppActions.setLocalState(this.props.ctx, {invite: false});
    }

    doStandalone(ev) {
        window.open(this.userURL);
        this.doDismissURL();
    }

    doEmail(ev) {
        const body = encodeURIComponent(this.userURL);
        const subject = encodeURIComponent('URL for device interaction');
        const mailtoURL = 'mailto:?subject=' + subject + '&body=' + body;
        window.open(mailtoURL);
        this.doDismissURL();
    }

    doCopyURL(ev) {
        if (this.userURL) {
            navigator.clipboard.writeText(this.userURL)
                .then(() => {
                    console.log('Text copied OK to clipboard');
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                });
        }
        this.doDismissURL();
    }

    render() {
        return cE(rB.Modal, {show: !!this.props.invite,
                             onHide: this.doDismissURL,
                             animation: false},
                  cE(rB.Modal.Header, {
                      className : 'bg-warning text-warning',
                      closeButton: true},
                     cE(rB.Modal.Title, null, 'URL')
                    ),
                  cE(rB.ModalBody, null,
                     cE(rB.Form, {horizontal: true},
                        cE(rB.FormGroup, {controlId: 'urlId'},
                           cE(rB.Col, {sm: 12},
                              cE(rB.FormControl.Static,
                                 {style: {wordWrap: "break-word"}},
                                 this.userURL)
                             )
                          )
                       )
                    ),
                  cE(rB.Modal.Footer, null,
                     cE(rB.ButtonGroup, null,
                        cE(rB.Button, {onClick: this.doCopyURL},
                           'Copy to Clipboard'),
                        cE(rB.Button, {onClick: this.doStandalone},
                           'Open Standalone'),
                        cE(rB.Button, {bsStyle: 'danger',
                                       onClick: this.doEmail}, 'Email')
                       )
                    )
                 );
    }
};

module.exports = DisplayURL;
