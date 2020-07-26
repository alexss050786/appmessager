import React from 'react';

import './showMessage.css';

class ShowMessage extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.props.onClose();
  }

  render() {
    if (
      this.props.type !== 'success'
      && this.props.type !== 'error'
      && this.props.type !== 'info'
      && this.props.type !== 'hide'
    ) {
      throw new Error('Invalid Type');
    }

    if (this.props.type === 'hide') {
      return null;
    }

    if (this.props.type) {
      return (
        <div
          className={`
                    showmessage-container
                    background-${this.props.type}
                    ${this.props.position}
                    ${this.props.textAlign}
                `}
        >
          {this.props.children}
          <button
            type="button"
            id="close"
            className={`showmessage-container background-${this.props.type}`}
            onClick={this.handleClose}
          >
            X
          </button>
        </div>
      );
    }

    return null;
  }
}

ShowMessage.defaultProps = {
  type: 'hide',
  position: 'top right',
  textAlign: 'text-center',
};

export default ShowMessage;
