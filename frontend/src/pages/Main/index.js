import React from 'react';
import io from 'socket.io-client';

import Header from '../../components/Header/Header';
import MenuContactGroup from '../../components/MenuContactGroup/MenuContactGroup';
import Contact from '../../components/Contact/Contact';
import ContactNotConfirmed from '../../components/Contact/ContactNotConfirmed';
import Group from '../../components/Group/Group';
import Message from '../../components/Message/Message';
import ShowMessage from '../../components/ShowMessage/ShowMessage';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

import './Main.css';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.handleContactClick = this.handleContactClick.bind(this);
    this.handleShowMessageClose = this.handleShowMessageClose.bind(this);
    this.handleShowMessage = this.handleShowMessage.bind(this);
    this.socket = io('http://10.0.0.15:3333', {
      query: { userId: localStorage.getItem('user_id') },
    });
    this.state = {
      contact: {},
      showMessageType: 'hide',
      showMessageText: '',
      showMessageTextAlign: 'text-center',
      newMessageFromUser: {},
      // menu contact group
      contactActive: true,
      contactNotConfirmedActive: false,
      groupActive: false,
    };
  }

  handleContactClick(_event, contact) {
    this.setState({
      contact,
    });
  }

  handleShowMessageClose() {
    this.setState({
      showMessageType: 'hide',
    });
  }

  handleShowMessage(message) {
    this.setState(message);
  }

  handleMenuContactClick() {
    this.setState({
      contactActive: true,
      contactNotConfirmedActive: false,
      groupActive: false,
    });
  }

  handleMenuContactNotConfirmedClick() {
    this.setState({
      contactActive: false,
      contactNotConfirmedActive: true,
      groupActive: false,
    });
  }

  handleMenuGroupClick() {
    this.setState({
      contactActive: false,
      contactNotConfirmedActive: false,
      groupActive: true,
    });
  }

  render() {
    return (
      <ErrorBoundary>
        <ShowMessage
          type={this.state.showMessageType}
          textAlign={this.state.showMessageTextAlign}
          onClose={this.handleShowMessageClose}
        >
          {this.state.showMessageText}
        </ShowMessage>
        <div className="main-container">
          <Header
            userContact={this.state.contact}
            socket={this.socket}
            history={this.props.history}
            onShowMessage={this.handleShowMessage}
          />

          <div className="container-row-column">
            <div className="contact-group-container">
              <MenuContactGroup
                onMenuContactClick={() => this.handleMenuContactClick()}
                onMenuContactNotConfirmedClick={() => this.handleMenuContactNotConfirmedClick()}
                onMenuGroupClick={() => this.handleMenuGroupClick()}
              />
              <Contact
                socket={this.socket}
                newMessageFromUserToContact={this.state.newMessageFromUser}
                onContactClick={this.handleContactClick}
                onShowMessage={this.handleShowMessage}
                active={this.state.contactActive}
              />
              <ContactNotConfirmed
                onShowMessage={this.handleShowMessage}
                active={this.state.contactNotConfirmedActive}
              />
              <Group
                onShowMessage={this.handleShowMessage}
                active={this.state.groupActive}
              />
            </div>
            <Message
              contact={this.state.contact}
              socket={this.socket}
              onNotifyNewMessage={(userFrom) => this.setState({ newMessageFromUser: userFrom })}
              onShowMessage={this.handleShowMessage}
            />
          </div>
        </div>
      </ErrorBoundary>
    );
  }
}
