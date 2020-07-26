/* eslint-disable jsx-a11y/interactive-supports-focus */
import React from 'react';

import Button from '../Form/Button/Button';

import './ContactItem.css';

export default class ContactItem extends React.Component {
  render() {
    const { user } = this.props.contact;

    if (this.props.contactNotConfirmed) {
      return (
        <div className="contact-container contact-not-confirmed-item b-primary">
          <div className="contact-container item">
            <img src={user.avatar} alt="" />
            <strong>{user.firstname}</strong>
          </div>
          <div className="contact-container item option">
            <Button
              title="Confirmar Contato"
              onClick={() => this.props.onConfirmContactAccept(user)}
              isVisible={this.props.contact.confirmed === false}
            >
              Sim
            </Button>
            <Button
              title="Rejeitar Contato"
              onClick={() => this.props.onConfirmContactReject(user)}
              isVisible={this.props.contact.confirmed === false}
            >
              Não
            </Button>
            <p
              className={this.props.contact.confirmed === false ? 'hide' : ''}
              title={`Aguardando ${user.firstname} confirmar seu contato`}
            >
              Aguardando...
            </p>
          </div>
        </div>
      );
    }

    return (
      <div
        className="contact-container item b-primary"
        onClick={(event) => this.props.onContactItemClick(event)}
        onKeyPress={(event) => this.props.onContactItemClick(event)}
        role="button"
      >
        <img src={user.avatar} alt="" />
        <strong>{user.firstname}</strong>
      </div>
    );
  }
}
