'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const AppActions = require('../actions/AppActions');
const InitialData = require('./initialData');
const Excalidraw = require('@excalidraw/excalidraw').default;
const assert = require('assert');
const cli = require('caf_cli');

const NUM_CHARS = 8;

const deepEqual = function(x, y) {
    try {
        assert.deepEqual(x, y);
        return true;
    } catch (ex) {
        return false;
    }
};

const deepClone = function(x) {
    return x ? JSON.parse(JSON.stringify(x)) : x;
};

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.excalidrawRef = React.createRef();
        this.excalidrawWrapperRef = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.lastElements = [];
        this.resetId();
        this.state = {
            width: 300,
            height: 200
        };
    }

    resetId() {
        this.myId = cli.randomString(NUM_CHARS);
        this.counter = 0;
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.epoch < this.props.epoch) {
            this.excalidrawRef.current.resetScene();
            this.resetId();
            this.excalidrawRef.current.updateScene(
                {elements: this.props.elements, appState: InitialData.appState}
            );
        } else if ((!this.props.sourceId ||
                    (this.props.sourceId.id !== this.myId) ||
                    (this.props.sourceId.counter > this.counter)) &&
                   (!deepEqual(this.lastElements, this.props.elements))) {
            if (this.excalidrawRef.current) {
                this.lastElements = deepClone(this.props.elements);
                this.excalidrawRef.current.updateScene(
                    {elements: this.props.elements}
                );
                /*
                 * With sourceId we are trying to identify sequences of
                 * our own updates that have not been in conflict with other
                 * updates. In that case we don't redo the update when it
                 * comes back from the server, to avoid stuttering.
                 *
                 * Unfortunately, when mixing with other client updates, we
                 * need to process them all to guarantee that all replicas end
                 * up in the same state. We do that by reseting the sourceId.
                 *
                 * A reset could trigger more resets because we assume our
                 * previous requests are foreign. In practice this transient
                 * does not last for very long...
                 */

                if (this.props.sourceId &&
                    (this.props.sourceId.id !== this.myId)) {
                    this.resetId();
                }
            }
        }
    }

    handleChange(elements, state) {
        if (!deepEqual(elements, this.lastElements)) {
            this.lastElements = deepClone(elements);
            this.counter = this.counter + 1;
            const sourceId = {counter: this.counter, id: this.myId};
            AppActions.updateElements(this.props.ctx, this.props.epoch,
                                      sourceId, elements);
        }
    }

    handleResize() {
        this.setState({
            width: this.excalidrawWrapperRef.current.getBoundingClientRect()
                .width,
            height: this.excalidrawWrapperRef.current.getBoundingClientRect()
                .height
        });
    }

    render() {
        return cE('div', { className: 'board-fit',
                           ref: this.excalidrawWrapperRef },
                  cE(Excalidraw, {
                      ref: this.excalidrawRef,
                      width: this.state.width,
                      height: this.state.height,
                      initialData: {elements: this.props.elements,
                                    appState: InitialData.appState},
                      onChange: this.handleChange,
                      theme: this.props.dark ? 'dark' : 'light',
                      UIOptions: {
                          canvasActions: {
                              changeViewBackgroundColor: false,
                              clearCanvas: false,
                              export: false,
                              loadScene: false,
                              saveToActiveFile: false,
                              theme: false,
                              saveAsImage: false
                          }
                      }
                  })
                 );
    }
}

module.exports = Board;
