'use strict';

const React = require('react');
const AppActions = require('../actions/AppActions');
const DisplayError = require('./DisplayError');
const Board = require('./Board');
const MenuBurger = require('./MenuBurger');
const DisplayURL = require('./DisplayURL');

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
                      isUserSession ?
                          cE('div', {key: 131}) :
                          cE(MenuBurger, {
                              key: 131,
                              ctx: this.props.ctx,
                              isClosed: this.state.isClosed,
                              fullName: this.state.fullName,
                              dark: this.state.dark
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
