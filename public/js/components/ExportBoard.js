'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const AppActions = require('../actions/AppActions');
const assert = require('assert');
const InitialData = require('./initialData');

const SVG_TYPE = 'image/svg+xml';
const JSON_TYPE = 'application/json';

// This is a hack to help browserify reduce bundle size (see bin/build.sh)
const {exportToSvg, serializeAsJSON} = (process.env.NODE_ENV === "production") ?
    require('@excalidraw/excalidraw/dist/excalidraw.production.min.js') :
    require('@excalidraw/excalidraw/dist/excalidraw.development.js');

const deepEqual = function(x, y) {
    try {
        assert.deepEqual(x, y);
        return true;
    } catch (ex) {
        return false;
    }
};

class ExportBoard extends React.Component {

    constructor(props) {
        super(props);
        this.doDismiss = this.doDismiss.bind(this);
        this.doJSON = this.doJSON.bind(this);
        this.doSVG = this.doSVG.bind(this);
        this.doClipboard = this.doClipboard.bind(this);
        this.doSave = this.doSave.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.state = {
            contents: '',
            type: JSON_TYPE
        };
    }

    componentDidMount() {
        this.doJSON();
    }

    componentDidUpdate(prevProps) {
        if (this.props.exportBoard && !prevProps.exportBoard) {
            this.handleChange(this.state.type);
        } else if (this.props.exportBoard &&
                   !deepEqual(prevProps.elements, this.props.elements)) {
            this.handleChange(this.state.type);
        }
    }

    doDismiss(ev) {
        AppActions.setLocalState(this.props.ctx, {exportBoard: false});
    }

    doJSON(ev) {
        const contents = serializeAsJSON(this.props.elements || [],
                                         InitialData.appState);
        this.setState({contents, type: JSON_TYPE});
    }

    async doSVG(ev) {
        const options = {
            exportPadding: 0,
            exportBackground: false
        };
        const appState = Object.assign({}, InitialData.appState, options);
        const svg = await exportToSvg({
            elements: this.props.elements || [], appState
        });
        this.setState({contents: svg.outerHTML, type: SVG_TYPE});
    }

    handleChange(e) {
        if (e === JSON_TYPE) {
            this.doJSON();
        } else if (e === SVG_TYPE) {
            this.doSVG();
        } else {
            throw new Error(`Bug: invalid value ${e} in handleChange`);
        }
    }

    doSave(ev) {
        if (this.state.contents) {
            const blob = new window.Blob([this.state.contents],
                                         {type: this.state.type});
            const blobURL = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobURL;
            const d = new Date();
            a.download = `excalidraw-${d.getSeconds()}-${d.getMilliseconds()}`;
            // Just once, then GC
            const handler = function() {
                setTimeout(() => {
                    window.URL.revokeObjectURL(blobURL);
                    this.removeEventListener('click', handler);
                }, 200);
            };
            a.addEventListener('click', handler, false);
            a.click();
        } else {
            AppActions.setError(this.props.ctx,
                                new Error('Save to file: missing text'));
        }
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
                          ),
                        cE(rB.FormGroup, {controlId: 'selectId'},
                           cE(rB.Col, {sm: 12},
                              cE(rB.ToggleButtonGroup, {
                                  type: 'radio',
                                  name: 'type',
                                  value: this.state.type,
                                  onChange: this.handleChange
                              },
                                 cE(rB.ToggleButton, {
                                     value: JSON_TYPE
                                 }, 'JSON'),
                                 cE(rB.ToggleButton, {
                                     value: SVG_TYPE
                                 }, 'SVG')
                                )
                             )
                          )
                       )
                    ),
                  cE(rB.Modal.Footer, null,
                     cE(rB.ButtonGroup, null,
                        cE(rB.Button, {bsStyle: 'primary',
                                       onClick: this.doDismiss},
                           'Cancel'),
                         cE(rB.Button, {onClick: this.doClipboard},
                           'Copy to Clipboard'),
                        cE(rB.Button, {bsStyle: 'danger',
                                       onClick: this.doSave}, 'Download')
                       )
                    )
                 );
    }
};

module.exports = ExportBoard;
