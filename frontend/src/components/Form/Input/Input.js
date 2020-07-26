import React, { Component } from 'react';

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: props.isValid,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.isValid !== state.isValid) {
      return {
        isValid: props.isValid,
      };
    }

    return null;
  }

  handleIsRequired(event) {
    const isValid = this.props.isRequired && event.target.value !== '';
    this.setState({
      isValid,
    });
    if (this.props.onIsValid) {
      this.props.onIsValid(isValid);
    }
  }

  handleChange(event) {
    if (this.props.onChange) {
      this.props.onChange(event);
    }
    this.handleIsRequired(event);
  }

  render() {
    let background;
    if (this.state.isValid) {
      background = 'background-success';
    } else {
      background = 'background-error';
    }
    return (
      <input
        className={`
                    ${this.props.isVisible ? 'show' : 'hide'}
                    ${this.state.isValid === null ? '' : background}
                `}
        type={this.props.type}
        placeholder={this.props.placeholder}
        value={this.props.value}
        onChange={(event) => this.handleChange(event)}
        onBlur={(event) => this.handleIsRequired(event)}
      />
    );
  }
}

Input.defaultProps = {
  isRequired: false,
  isVisible: true,
  isValid: null,
};

export default Input;
