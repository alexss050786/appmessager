/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import Login from '../../components/Login/Login';
import NewUser from '../../components/UserForm/UserForm';
import ShowMessage from '../../components/ShowMessage/ShowMessage';

import './Login.css';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginClose = this.handleLoginClose.bind(this);
    this.handleRegisterClose = this.handleRegisterClose.bind(this);
    this.handleShowMessegeClose = this.handleShowMessegeClose.bind(this);
    this.handleShowMessage = this.handleShowMessage.bind(this);
    this.state = {
      showMessageType: 'hide',
      showMessageText: '',
      showMessageTextAlign: 'text-center',
      showRegister: false,
      showLogin: true,
      loginNotExist: '',
    };
  }

  handleShowMessegeClose() {
    this.setState({
      showMessageType: 'hide',
    });
  }

  handleShowMessage(message) {
    this.setState(message);
  }

  handleLoginClose() {
    this.setState({
      showRegister: true,
      showLogin: false,
    });
  }

  handleRegisterClose() {
    this.setState({
      showRegister: false,
      showLogin: true,
    });
  }

  render() {
    return (
      <>
        <ShowMessage
          type={this.state.showMessageType}
          textAlign={this.state.showMessageTextAlign}
          onClose={this.handleShowMessegeClose}
        >
          {this.state.showMessageText}
        </ShowMessage>
        <div className="login-container">
          <div className="login-content">
            <Login
              onShowMessage={this.handleShowMessage}
              onLoginClose={this.handleLoginClose}
              onLoginNotExist={(loginNotExist) => {
                console.log(loginNotExist);
                this.setState({ loginNotExist });
              }}
              isVisible={this.state.showLogin}
              {...this.props}
            />
            <NewUser
              onShowMessage={this.handleShowMessage}
              onRegisterClose={this.handleRegisterClose}
              isVisible={this.state.showRegister}
              loginDefault={this.state.loginNotExist}
              {...this.props}
            />
          </div>
        </div>
      </>
    );
  }
}
