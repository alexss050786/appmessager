import React from 'react';
import api from '../../services/api';

import ContactItem from './ContactItem';
import SearchBar from '../SearchBar/SearchBar';
import NewContact from '../Form/InputButtonToggle/InputButtonToggle';
import ShowMessage from '../ShowMessage/ShowMessage';
import Button from '../Form/Button/Button';
import UserContactInfo from '../UserInfo/UserInfo';

import './Contact.css';

export default class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.handleNotifyNewContact = this.handleNotifyNewContact.bind(this);
    this.handleNotifyNewContactConfirmed = this.handleNotifyNewContactConfirmed.bind(
      this,
    );
    this.handleNotifyNewContactNotConfirmed = this.handleNotifyNewContactNotConfirmed.bind(
      this,
    );
    this.state = {
      contacts: [],
      loginEmailContact: '',
      preview: false,
      showMessageType: 'hide',
      showMessageText: '',
    };
  }

  componentDidMount() {
    this.userId = localStorage.getItem('user_id');
    this.token = localStorage.getItem('token');

    this.props.socket.on('newcontact', this.handleNotifyNewContact);
    this.props.socket.on(
      'newcontactconfirmed',
      this.handleNotifyNewContactConfirmed,
    );
    this.props.socket.on(
      'newcontactnotconfirmed',
      this.handleNotifyNewContactNotConfirmed,
    );

    this.loadContacts();
  }

  componentWillUnmount() {
    this.props.socket.off('newcontact', this.handleNotifyNewContact);
    this.props.socket.off(
      'newcontactconfirmed',
      this.handleNotifyNewContactConfirmed,
    );
    this.props.socket.off(
      'newcontactnotconfirmed',
      this.handleNotifyNewContactNotConfirmed,
    );
  }

  async loadContacts() {
    const response = await api.get(`/users/${this.userId}/contacts`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    const { data: contacts } = response.data;

    this.setState({
      contacts,
    });
  }

  handleNotifyNewContact(response) {
    const { detail } = response;
    this.userContact = response.data;
    this.setState({
      showMessageType: 'info',
      showMessageText: `${detail}`,
    });
  }

  handleNotifyNewContactConfirmed(response) {
    const { data, detail } = response;

    this.setState((state) => ({
      contacts: [data, ...state.contacts],
      showMessageType: 'hide',
    }));

    this.props.onShowMessage({
      showMessageType: 'info',
      showMessageText: `${detail}`,
    });
  }

  handleNotifyNewContactNotConfirmed(response) {
    const { detail } = response;
    this.props.onShowMessage({
      showMessageType: 'info',
      showMessageText: `${detail}`,
    });
  }

  async handleConfirmContactAccept() {
    try {
      await api.put(
        `/users/${this.userId}/contacts/${this.userContact.id}`,
        {
          confirmed: true,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      if (this.state.preview) {
        this.setState({
          preview: false,
        });
      }
    } catch (error) {
      const { detail } = error.response.data;

      this.props.onShowMessage({
        showMessageType: 'error',
        showMessageText: `${detail}`,
      });
    }
  }

  async handleConfirmContactReject() {
    try {
      await api.delete(
        `/users/${this.userId}/contacts/${this.userContact.id}`,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      if (this.state.preview) {
        this.setState({
          preview: false,
        });
      }

      this.setState({
        showMessageType: 'hide',
      });
    } catch (error) {
      const { detail } = error.response.data;

      this.props.onShowMessage({
        showMessageType: 'error',
        showMessageText: `${detail}`,
      });
    }
  }

  async handleContactPreviwer() {
    this.setState((state) => ({
      preview: !state.preview,
    }));
  }

  handleSearch(_event, contacts) {
    this.setState({
      contacts,
    });
  }

  handleAddContactChange(event) {
    this.setState({
      loginEmailContact: event.target.value,
    });
  }

  async handleAddContactClick() {
    try {
      if (this.state.loginEmailContact.trim() === '') {
        return;
      }
      const response = await api.post(
        `/users/${this.userId}/contacts`,
        {
          loginEmailContact: this.state.loginEmailContact,
        },
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      const { detail } = response.data;

      if (detail) {
        this.props.onShowMessage({
          showMessageType: 'success',
          showMessageText: `${detail}`,
        });
      }
    } catch (error) {
      const { detail } = error.response.data;
      this.props.onShowMessage({
        showMessageType: 'error',
        showMessageText: `${detail}`,
      });
    }
  }

  handleContactItemClick(event, contact) {
    if (this.props.onContactClick) {
      this.props.onContactClick(event, contact);
    }
  }

  render() {
    if (this.props.active) {
      return (
        <div className="container contact-container background-quaternary b-secondary">
          <ShowMessage
            type={this.state.showMessageType}
            position="bottom right"
            onClose={() => this.setState({ showMessageType: 'hide', preview: false })}
          >
            {this.state.showMessageText}
            <hr />
            <div className="container-inline showmessage-button">
              <Button onClick={() => this.handleConfirmContactAccept()} info>
                Sim
              </Button>
              <Button onClick={() => this.handleConfirmContactReject()} info>
                Não
              </Button>
              <Button onClick={() => this.handleContactPreviwer()} info>
                Visualisar
              </Button>
            </div>
          </ShowMessage>
          <SearchBar
            route={`/users/${this.userId}/contacts`}
            placeholder="Procurar Contatos"
            dataSearch={{
              headers: {
                Authorization: `Bearer ${this.token}`,
              },
            }}
            onSearch={(event, contacts) => this.handleSearch(event, contacts)}
          />
          <NewContact
            placeholder="Login ou Eamil"
            buttonName="Adionar Contato"
            onChange={(event) => this.handleAddContactChange(event)}
            onClick={(event) => this.handleAddContactClick(event)}
          />
          {this.state.contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              onContactItemClick={(event) => this.handleContactItemClick(event, contact)}
            />
          ))}
          {this.state.preview && this.userContact ? (
            <UserContactInfo user={this.userContact} preview />
          ) : null}
        </div>
      );
    }
    return null;
  }
}
