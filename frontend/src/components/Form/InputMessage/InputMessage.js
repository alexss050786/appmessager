import React from 'react';

import './Inputmessage.css';

export default class InputMessage extends React.Component {
  constructor(props) {
    super(props);
    this.handleKeyEnter = this.handleKeyEnter.bind(this);
    this.state = {
      message: '',
    };
  }

  componentDidMount() {
    this.elInputMessage = document.getElementById('inputMessage');
    this.elInputMessage.addEventListener('keyup', this.handleKeyEnter);
  }

  componentWillUnmount() {
    this.elInputMessage.removeEventListener('keyup', this.handleKeyEnter);
  }

  handleMessage(event) {
    event.preventDefault();

    this.setState({
      message: event.target.value,
    });

    if (this.props.onChangeInputMessage) {
      this.props.onChangeInputMessage(event);
    }
  }

  handleKeyEnter(event) {
    if (event.key === 'Enter') {
      if (this.props.onKeyEnter) {
        this.props.onKeyEnter(this.state.message);
      }
      this.setState({
        message: '',
      });
    }
  }

  render() {
    return (
      <div className="input-container">
        <textarea
          id="inputMessage"
          className="b-secondary"
          rows="2"
          placeholder="Digite sua Mensagem"
          value={this.state.message}
          onChange={(event) => this.handleMessage(event)}
        />
      </div>
    );
  }
}
