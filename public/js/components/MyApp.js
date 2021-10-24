'use strict';

const React = require('react');
const AppActions = require('../actions/AppActions');
const DisplayError = require('./DisplayError');
const Board = require('./Board');
const MenuBurger = require('./MenuBurger');
const DisplayURL = require('./DisplayURL');
const LoadBoard = require('./LoadBoard');
const ExportBoard = require('./ExportBoard');

const cE = React.createElement;

class MyApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.props.ctx.store.getState();
    }

    componentDidMount() {
        if (!this.unsubscribe) {
            this.unsubscribe = this.props.ctx.store
                .subscribe(this._onChange.bind(this));
            this._onChange();
        }
    }

    componentWillUnmount() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    }

    _onChange() {
        if (this.unsubscribe) {
            this.setState(this.props.ctx.store.getState());
        }
    }

    render() {
        const isUserSession = this.props.ctx && this.props.ctx.session &&
              this.props.ctx.session.isUserSession();

        return cE('div', {className: 'container-fluid'},
                  [
                      cE(DisplayError, {
                          key: 111,
                          ctx: this.props.ctx,
                          error: this.state.error
                      }),
                      cE(DisplayURL, {
                          key: 121,
                          ctx: this.props.ctx,
                          invite: this.state.invite
                      }),
                      cE(MenuBurger, {
                          key: 131,
                          ctx: this.props.ctx,
                          isUserSession: isUserSession,
                          isClosed: this.state.isClosed,
                          fullName: this.state.fullName,
                          dark: this.state.dark
                      }),
                      cE(LoadBoard, {
                          key: 19941,
                          ctx: this.props.ctx,
                          loadBoard: this.state.loadBoard
                      }),
                      cE(ExportBoard, {
                          key: 29941,
                          ctx: this.props.ctx,
                          elements: this.state.elements,
                          exportBoard: this.state.exportBoard

                      }),
                      cE(Board, {
                          key: 141,
                          ctx: this.props.ctx,
                          dark: this.state.dark,
                          elements: this.state.elements,
                          epoch: this.state.epoch,
                          sourceId: this.state.sourceId
                      })
                  ]
                 );
    }
};

module.exports = MyApp;
