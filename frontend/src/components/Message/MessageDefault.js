import React from 'react';

import messageDefault from '../../assets/img/msg_logo.png';

import './MessageDefault.css';

export default class MessageDefault extends React.Component {
  render() {
    return (
      <div className="container content-center messagedefault-container background-quaternary b-secondary">
        <img src={messageDefault} alt="" />
      </div>
    );
  }
}
