'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const AppActions = require('../actions/AppActions');
const assert = require('assert');

class LoadBoard extends React.Component {

    constructor(props) {
        super(props);
        this.doDismiss = this.doDismiss.bind(this);
        this.doReset = this.doReset.bind(this);
        this.doLoadFile = this.doLoadFile.bind(this);
        this.doUpdate = this.doUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.inputRef = React.createRef();
        this.state = {
            contents: ''
        };
    }

    doDismiss(ev) {
        AppActions.setLocalState(this.props.ctx, {loadBoard: false});
    }

    doReset(ev) {
        this.setState({contents: ''});
    }

    doLoadFile(ev) {
        if (this.inputRef.current) {
            this.inputRef.current.click();
        }
    }

    doUpdate(ev) {
        if (this.state.contents) {
            try {
                const all = JSON.parse(this.state.contents);
                assert(Array.isArray(all.elements));
                AppActions.load(this.props.ctx, all.elements);
                this.doDismiss();
            } catch (err) {
                AppActions.setError(this.props.ctx,
                                    new Error('Invalid JSON content'));
            }
        } else {
            AppActions.setError(this.props.ctx, new Error('Missing content'));
        }
    }

    handleChange(ev) {
        this.setState({contents: ev.target.value});
    }

    handleFileSelect(ev) {
        if (ev.target.files && (ev.target.files.length > 0)) {
            const reader = new window.FileReader();
            reader.onload = (e) => {
                this.setState({contents: e.target.result});
            };
            reader.readAsText(ev.target.files[0]);
        }
    }

    render() {
        return cE(rB.Modal, {show: !!this.props.loadBoard,
                             onHide: this.doDismiss,
                             animation: false},
                  cE(rB.Modal.Header, {
                      className: 'bg-primary text-primary',
                      style: {textAlign: 'center'},
                      closeButton: true},
                     cE(rB.Modal.Title, null, 'Load JSON Content')
                    ),
                  cE(rB.ModalBody, null,
                     cE(rB.Form, {horizontal: true},
                        cE(rB.FormGroup, {controlId: 'contentId'},
                           cE(rB.Col, {sm: 12},
                              cE(rB.FormControl,
                                 {componentClass: 'textarea',
                                  rows: 9,
                                  placeholder: '<Paste JSON here or upload' +
                                  ' file, then click Update>',
                                  spellcheck: 'false',
                                  value: this.state.contents,
                                  onChange: this.handleChange
                                 })
                             )
                          )
                       )
                    ),
                  cE('input', {
                      ref: this.inputRef,
                      type: 'file',
                      accept: 'application/json',
                      onChange: this.handleFileSelect,
                      style: {
                          display: 'none'
                      }
                  }),
                  cE(rB.Modal.Footer, null,
                     cE(rB.ButtonGroup, null,
                        cE(rB.Button, {bsStyle: 'primary',
                                       onClick: this.doDismiss},
                           'Cancel'),
                        cE(rB.Button, {bsStyle: 'danger',
                                       onClick: this.doReset}, 'Reset'),
                        cE(rB.Button, {onClick: this.doLoadFile},
                           'Upload'),
                        cE(rB.Button, {bsStyle: 'danger',
                                       disabled: !this.state.contents,
                                       onClick: this.doUpdate}, 'Update')
                       )
                    )
                 );
    }
};

module.exports = LoadBoard;
