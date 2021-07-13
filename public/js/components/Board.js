'use strict';

const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const AppActions = require('../actions/AppActions');
const InitialData = require('./initialData');
const Excalidraw = require('@excalidraw/excalidraw').default;

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.excalidrawRef = React.createRef();
        this.excalidrawWrapperRef = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleResize = this.handleResize.bind(this);
        this.state = {
            width: 300,
            height: 200
        };
    }

    componentDidMount() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize);
    }

    handleChange(elements, state) {
        console.log("Elements :", elements, "State : ", state);
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
                      initialData: InitialData,
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
