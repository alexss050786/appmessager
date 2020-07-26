import React from 'react';

import Input from '../Form/Input/Input';
import Button from '../Form/Button/Button';
import api from '../../services/api';

import './Login.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.handleLoginEmail = this.handleLoginEmail.bind(this);
    this.handlePassword = this.handlePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.state = {
      loginEmail: '',
      loginEmailValid: null,

      password: '',
      passwordValid: null,
    };
  }

  handleShowMessegeClose() {
    this.props.onShowMessage({
      showMessageType: 'hide',
    });
  }

  handleLoginEmail(event) {
    this.setState({
      loginEmail: event.target.value,
    });
  }

  handlePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  handleRegister() {
    if (this.props.onLoginClose) {
      this.props.onLoginClose();
    }
  }

  checkRequiredFields() {
    this.setState((state) => ({
      loginEmailValid:
        state.loginEmailValid === null ? false : state.loginEmailValid,
      passwordValid: state.passwordValid === null ? false : state.passwordValid,
    }));

    return !this.state.loginEmailValid || !this.state.passwordValid;
  }

  async handleSubmit(event) {
    event.preventDefault();

    if (this.checkRequiredFields()) {
      this.props.onShowMessage({
        showMessageType: 'error',
        showMessageText: 'Ops! Faltou algumas informações',
      });
      return;
    }
    try {
      const response = await api.post('/auth', null, {
        headers: {
          loginemail: this.state.loginEmail,
          password: this.state.password,
        },
      });

      const { data } = response.data;
      const { user, token } = data;

      localStorage.setItem('user_id', user.id);
      localStorage.setItem('token', token);

      this.props.onShowMessage({
        showMessageType: 'success',
        showMessageText: 'Login realizado com sucesso',
      });
      this.setState({
        loginEmailValid: true,
        passwordValid: true,
      });

      this.props.history.push('/');
    } catch (error) {
      const { data: user, detail } = error.response.data;
      this.props.onShowMessage({
        showMessageType: 'error',
        showMessageText: `${detail}`,
      });

      if (!user) {
        this.setState({
          loginEmailValid: false,
          passwordValid: null,
          password: '',
        });
        if (this.props.onLoginNotExist) {
          this.props.onLoginNotExist(this.state.loginEmail);
        }
        return;
      }

      this.setState({
        loginEmailValid: true,
        passwordValid: false,
        password: '',
      });
    }
  }

  render() {
    return (
      <div
        className={`
                    login-form background-primary b-secondary
                    ${this.props.isVisible ? 'show login-form-move' : 'hide'}
                `}
      >
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <Input
            type="text"
            placeholder="Login ou Email"
            value={this.state.loginEmail}
            onChange={this.handleLoginEmail}
            isValid={this.state.loginEmailValid}
            onIsValid={(loginEmailValid) => {
              this.setState({ loginEmailValid });
            }}
            isRequired
          />
          <Input
            type="password"
            placeholder="Senha"
            value={this.state.password}
            onChange={this.handlePassword}
            isValid={this.state.passwordValid}
            onIsValid={(passwordValid) => {
              this.setState({ passwordValid });
            }}
            isRequired
          />
          <Button type="submit">Entrar</Button>
        </form>
        <hr />
        <footer>
          <Button disabled>Esqueci a Senha</Button>
          <Button onClick={this.handleRegister}>Cadastrar-se</Button>
        </footer>
      </div>
    );
  }
}

Login.defaultProps = {
  isVisible: true,
};

export default Login;
