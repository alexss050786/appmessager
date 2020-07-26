import React from 'react';

import './InputButtonToggle.css';

class InputButtonToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      inputText: '',
    };
  }

  handleChange(event) {
    this.setState({
      inputText: event.target.value,
    });

    if (this.props.onChange) {
      this.props.onChange(event);
    }
  }

  handleClick(event) {
    if (!this.state.active) {
      this.setState({
        active: true,
      });
      return;
    }

    if (this.props.onClick) {
      this.props.onClick(event);
    }

    this.setState({
      active: false,
      inputText: '',
    });
  }

  render() {
    if (this.state.active) {
      return (
        <div className="inputbutton-container active">
          <input
            placeholder={this.props.placeholder}
            value={this.state.inputText}
            onChange={(event) => this.handleChange(event)}
          />
          <button type="button" onClick={(event) => this.handleClick(event)}>
            Ok
          </button>
        </div>
      );
    }

    return (
      <div className="inputbutton-container">
        <button type="button" onClick={(event) => this.handleClick(event)}>
          {this.props.buttonName}
        </button>
      </div>
    );
  }
}

InputButtonToggle.defaultProps = {
  placeholder: 'Digite Aqui',
  buttonName: 'Novo',
};

export default InputButtonToggle;
