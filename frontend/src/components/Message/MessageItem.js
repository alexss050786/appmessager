import React from 'react';

import './MessageItem.css';

export default class MessageItem extends React.Component {
  render() {
    const { message, from } = this.props.message;
    if (from === parseInt(this.props.userId, 10)) {
      return (
        <div className="container message-item from background-primary b-secondary">
          {message}
        </div>
      );
    }
    return (
      <div className="container message-item to background-quaternary b-secondary">
        {message}
      </div>
    );
  }
}
