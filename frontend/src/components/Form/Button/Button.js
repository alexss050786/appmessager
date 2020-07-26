/* eslint-disable react/button-has-type */
import React, { Component } from 'react';

class Button extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event) {
    if (this.props.onClick) {
      this.props.onClick(event);
    }
  }

  render() {
    return (
      <button
        type={this.props.type}
        title={this.props.title}
        className={`
                    ${this.props.className}
                    ${this.props.isVisible ? 'show' : 'hide'}
                    ${this.props.success ? 'background-success' : ''}
                    ${this.props.info ? 'background-info' : ''}
                    ${this.props.error ? 'background-error' : ''}
                    ${this.props.disabled ? 'background-disabled' : ''}
                `}
        placeholder={this.props.placeholder}
        value={this.props.value}
        onClick={this.handleClick}
        disabled={this.props.disabled}
      >
        <strong>{this.props.children}</strong>
      </button>
    );
  }
}

Button.defaultProps = {
  success: false,
  info: false,
  error: false,
  isVisible: true,
};

export default Button;
