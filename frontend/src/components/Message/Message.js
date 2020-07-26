import React, { Component } from 'react';

import api from '../../services/api';
import MessageDefault from './MessageDefault';
import MessageItem from './MessageItem';
import InputMessage from '../Form/InputMessage/InputMessage';
import SearchBar from '../SearchBar/SearchBar';

import './Message.css';

class Message extends Component {
  constructor(props) {
    super(props);
    this.handleMessageReceived = this.handleMessageReceived.bind(this);
    this.state = {
      messages: [],
    };
  }

  componentDidMount() {
    this.userId = localStorage.getItem('user_id');
    this.token = localStorage.getItem('token');

    this.props.socket.on('newmessage', this.handleMessageReceived);

    this.loadMessage();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.contact.id !== this.props.contact.id) {
      this.loadMessage();
    }
  }

  componentWillUnmount() {
    this.props.socket.off('newmessage', this.handleMessageReceived);
  }

  async loadMessage() {
    if (!this.props.contact.id) {
      return;
    }
    try {
      const response = await api.get(
        `/users/${this.userId}/messages/${this.props.contact.user.id}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      const { data: messages } = response.data;

      this.setState({
        messages,
      });
    } catch (error) {
      const { detail } = error.response.data;
      this.props.onShowMessage({
        showMessageType: 'error',
        showMessageText: `${detail}`,
      });
    }
  }

  async handleMessageSend(message) {
    try {
      const response = await api.post(
        `/users/${this.userId}/messages/${this.props.contact.user.id}`,
        {
          message,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      const { data: newMessage } = response.data;

      this.setState((state) => ({
        messages: [...state.messages, newMessage],
      }));
    } catch (error) {
      const { detail } = error.response.data;
      this.props.onShowMessage({
        showMessageType: 'error',
        showMessageText: `${detail}`,
      });
    }
  }

  handleMessageReceived(message) {
    const { userFrom, newMessage } = message.data;

    if (this.props.contact.id) {
      this.setState((state) => ({
        messages: [...state.messages, newMessage],
      }));
      return;
    }

    if (this.props.onNotifyNewMessage) {
      this.props.onNotifyNewMessage(userFrom);
    }
  }

  handleSearch(_event, messages) {
    if (messages && messages.length) {
      this.setState({
        messages,
      });
      return;
    }

    this.setState({
      messages: null,
    });
  }

  render() {
    if (this.props.contact.id) {
      if (!this.state.messages) {
        return (
          <div className="container content-center message-container message-not-found nomessage background-quaternary b-secondary">
            <p>Nenhuma Mensagem encontrada</p>
            <button type="button" onClick={() => this.loadMessage()}>
              Voltar
            </button>
          </div>
        );
      }

      if (this.state.messages.length) {
        return (
          <div className="container message-container background-quaternary b-secondary">
            <SearchBar
              route={`/users/${this.userId}/messages/${this.props.contact.user.id}`}
              placeholder="Procurar Mensagens"
              dataSearch={{
                headers: {
                  Authorization: `Bearer ${this.token}`,
                },
              }}
              onSearch={(event, messages) => this.handleSearch(event, messages)}
            />
            <div className="message">
              {this.state.messages.map((message) => (
                <MessageItem
                  key={message.id}
                  userId={this.userId}
                  message={message}
                />
              ))}
            </div>
            <InputMessage
              onKeyEnter={(message) => this.handleMessageSend(message)}
            />
          </div>
        );
      }

      return (
        <div className="container content-center messagedefault-container nomessage background-quaternary b-secondary">
          <p>Inicie uma conversa com</p>
          <strong>{this.props.contact.user.firstname}</strong>
          <InputMessage
            onKeyEnter={(message) => this.handleMessageSend(message)}
          />
        </div>
      );
    }

    return <MessageDefault />;
  }
}

Message.defaultProps = {
  contact: {},
};

export default Message;
