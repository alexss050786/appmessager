import React, { Component } from 'react';

import api from '../../services/api';
import ContactItem from './ContactItem';

import './Contact.css';

export default class ContactNotConfirmed extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
    };
  }

  componentDidMount() {
    this.userId = localStorage.getItem('user_id');
    this.token = localStorage.getItem('token');

    this.loadContactNotConfirmed();
  }

  componentDidUpdate(prevProps) {
    if (this.props.active && prevProps.active !== this.props.active) {
      this.loadContactNotConfirmed();
    }
  }

  updateContacts(userContact) {
    this.setState((state) => ({
      contacts: state.contacts.filter(
        (contact) => contact.user.id !== userContact.id,
      ),
    }));
  }

  async loadContactNotConfirmed() {
    const response = await api.get(
      `/users/${this.userId}/contactsnotconfirmed`,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      },
    );

    const { data: contacts } = response.data;

    this.setState({
      contacts,
    });
  }

  async handleConfirmContactAccept(userContact) {
    try {
      await api.put(
        `/users/${this.userId}/contacts/${userContact.id}`,
        {
          confirmed: true,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      this.updateContacts(userContact);
    } catch (error) {
      const { detail } = error.response.data;

      this.props.onShowMessage({
        showMessageType: 'error',
        showMessageText: `${detail}`,
      });
    }
  }

  async handleConfirmContactReject(userContact) {
    '';

    try {
      await api.delete(`/users/${this.userId}/contacts/${userContact.id}`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      this.updateContacts(userContact);
    } catch (error) {
      const { detail } = error.response.data;

      this.props.onShowMessage({
        showMessageType: 'error',
        showMessageText: `${detail}`,
      });
    }
  }

  render() {
    if (this.props.active) {
      if (this.state.contacts.length) {
        return (
          <div className="container contact-container background-quaternary b-secondary">
            <strong>Contatos não Confirmados</strong>
            {this.state.contacts.map((contact) => (
              <ContactItem
                key={contact.id}
                contact={contact}
                onConfirmContactAccept={(user) => this.handleConfirmContactAccept(user)}
                onConfirmContactReject={(user) => this.handleConfirmContactReject(user)}
                contactNotConfirmed
              />
            ))}
          </div>
        );
      }

      return (
        <div className="container contactnotconfirmed-container background-quaternary b-secondary">
          <strong>Nenhum contato não confirmado</strong>
        </div>
      );
    }

    return null;
  }
}
