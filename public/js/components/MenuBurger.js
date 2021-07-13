const React = require('react');
const rB = require('react-bootstrap');
const cE = React.createElement;
const rbm = require('react-burger-menu');
const AppActions = require('../actions/AppActions');
const AppStatus = require('./AppStatus');

const REMOVE_KEY = 1;
const ADD_KEY = 2;
const DROPDOWN_KEY = 3;
const REGISTER_KEY = 4;
const UNREGISTER_KEY = 5;

const styles = {
    bmBurgerButton: {
        width: '36px',
        height: '30px',
        position: 'absolute',
        top: '30px',
        right: '36px'
    },
    bmBurgerBars: {
        //        background: '#373a47',
        background: '#FFA500',
        opacity: '0.9'
    },
    bmCrossButton: {
        height: '24px',
        width: '24px'
    },
    bmCross: {
        background: '#bdc3c7'
    },
    bmMenu: {
        background: '#373a47',
        padding: '1.5em 1.0em 0',
        fontSize: '1.10em'
    },
    bmMorphShape: {
        fill: '#373a47'
    },
    bmItemList: {
        color: '#b8b7ad',
        padding: '0.8em',
        'overflowY': 'auto'
    },
    bmItem: {
        display: 'block',
        margin: '10px'
    },
    bmOverlay: {
        background: 'rgba(0, 0, 0, 0.3)'
    }
};


class MenuBurger extends  React.Component  {

     constructor(props) {
         super(props);
         this.state = {
             menuOpen: false
         };
         this.stateChange = this.stateChange.bind(this);
         this.invite = this.invite.bind(this);
         this.reset = this.reset.bind(this);
         this.darkLight = this.darkLight.bind(this);
     }

    invite(event) {
        event.preventDefault();
        this.closeMenu();
        AppActions.setLocalState(this.props.ctx, {invite: true});
    }

    reset(event) {
        event.preventDefault();
        this.closeMenu();
        AppActions.reset(this.props.ctx);
    }

    darkLight(event) {
        event.preventDefault();
        this.closeMenu();
        AppActions.setDark(this.props.ctx, !this.props.dark);
    }

    stateChange(state) {
        this.setState({menuOpen: state.isOpen});
    }

    closeMenu () {
        this.setState({menuOpen: false});
    }

    render() {
        return cE(rbm.slide, {styles: styles, right: true,
                              width: 375,
                              isOpen: this.state.menuOpen,
                              onStateChange: this.stateChange
                             },
                  [
                      cE('a', {
                          className: 'menu-heading-item',
                          key: 9883347
                      }, cE(AppStatus, {
                          isClosed: this.props.isClosed
                      }), cE('span', null, this.props.fullName)
                        ),
                      cE('hr', {key: 53434}),
                      cE('a', {
                          className:  'menu-item',
                          key: 12114,
                          onClick: this.invite
                      },  cE('span', {
                          className: 'glyphicon glyphicon-envelope text-success'
                      }), cE('span', null, ' Invite')),

                      cE('a', {
                          className:  'menu-item',
                          key: 121424,
                          onClick: this.darkLight
                      },  cE('span', {
                          className: 'glyphicon glyphicon-text-background' +
                              ' text-success'
                      }), cE('span', null, ' Dark/Light')),

                      cE('a', {
                          className:  'menu-item',
                           key: 3312114,
                          onClick: this.reset
                      },  cE('span', {
                          className: 'glyphicon  glyphicon-trash text-danger'
                      }), cE('span', null, ' Reset')),

                      cE('hr', {key: 43434})
                  ]
                 );
    }
}

module.exports = MenuBurger;
