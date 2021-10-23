'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const AppActions = require('../actions/AppActions');
const assert = require('assert');
const InitialData = require('./initialData');

// This is a hack to help browserify reduce bundle size (see bin/build.sh)
const {exportToSvg, serializeAsJSON} = (process.env.NODE_ENV === "production") ?
    require('@excalidraw/excalidraw/dist/excalidraw.production.min.js') :
    require('@excalidraw/excalidraw/dist/excalidraw.development.js');

class ExportBoard extends React.Component {

    constructor(props) {
        super(props);
        this.doDismiss = this.doDismiss.bind(this);
        this.doJSON = this.doJSON.bind(this);
        this.doSVG = this.doSVG.bind(this);
        this.doClipboard = this.doClipboard.bind(this);
        this.doSave = this.doSave.bind(this);

        this.state = {
            contents: ''
        };
    }

    doDismiss(ev) {
        AppActions.setLocalState(this.props.ctx, {exportBoard: false});
    }

    doJSON(ev) {
        const contents = serializeAsJSON(this.props.elements,
                                         InitialData.appState);
        this.setState({contents});
    }

    async doSVG(ev) {
        const options = {
            exportPadding: 0,
            exportBackground: false
        };
        const svg = await exportToSvg({elements: this.props.elements,
                                       appState: {...InitialData.appState,
                                                  ...options}
                                      });
        this.setState({contents: svg.outerHTML});
    }

    doSave(ev) {

    }

    doClipboard(ev) {
        if (this.state.contents) {
            if (!navigator.clipboard) {
                AppActions.setError(this.props.ctx,
                                    new Error('navigator.clipboard missing'));
            } else {
                navigator.clipboard.writeText(this.state.contents)
                    .then(() => {
                        console.log('Text copied OK to clipboard');
                    })
                    .catch(err => {
                        console.error('Could not copy text: ', err);
                        AppActions.setError(this.props.ctx,
                                            new Error('Cannot copy text'));
                    });
            }
        }
        this.doDismiss();
    }

    render() {
        return cE(rB.Modal, {show: !!this.props.exportBoard,
                             onHide: this.doDismiss,
                             animation: false},
                  cE(rB.Modal.Header, {
                      className: 'bg-primary text-primary',
                      style: {textAlign: 'center'},
                      closeButton: true},
                     cE(rB.Modal.Title, null, 'Export Content')
                    ),
                  cE(rB.ModalBody, null,
                     cE(rB.Form, {horizontal: true},
                        cE(rB.FormGroup, {controlId: 'contentId'},
                           cE(rB.Col, {sm: 12},
                              cE(rB.FormControl, {
                                  componentClass: 'textarea',
                                  rows: 9,
                                  spellcheck: 'false',
                                  readonly: true,
                                  value: this.state.contents
                              })
                             )
                          )
                       )
                    ),
                  cE(rB.Modal.Footer, null,
                     cE(rB.ButtonGroup, null,
                        cE(rB.Button, {bsStyle: 'primary',
                                       onClick: this.doDismiss},
                           'Cancel'),
                        cE(rB.Button, {onClick: this.doJSON}, 'to JSON'),
                        cE(rB.Button, {bsStyle: 'primary',
                                       onClick: this.doSVG}, 'to SVG'),
                         cE(rB.Button, {onClick: this.doClipboard},
                           'Copy to Clipboard'),
                        cE(rB.Button, {bsStyle: 'danger',
                                       onClick: this.doSave}, 'Save to File')
                       )
                    )
                 );
    }
};

module.exports = ExportBoard;
