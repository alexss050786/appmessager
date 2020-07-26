/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { Component } from 'react';

import api from '../../services/api';
import Input from '../Form/Input/Input';
import Button from '../Form/Button/Button';
import camera from '../../assets/img/camera.svg';

import './UserForm.css';

class UserForm extends Component {
  constructor(props) {
    super(props);
    this.handlePassword = this.handlePassword.bind(this);
    this.handlePasswordConfirm = this.handlePasswordConfirm.bind(this);
    this.handleImgChange = this.handleImgChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.state = {
      avatar: null,
      preview: null,

      login: '',
      loginValid: null,

      email: '',
      emailValid: null,

      password: '',
      passwordValid: null,

      passwordConfirm: '',
      passwordConfirmValid: null,

      firstname: '',
      firstnameValid: null,

      lastname: '',

      about: '',
    };
  }

  componentDidMount() {
    this.userId = localStorage.getItem('user_id');
    this.token = localStorage.getItem('token');

    if (!this.props.isNew) {
      this.setState({
        loginValid: true,
        emailValid: true,
        passwordValid: true,
        passwordConfirmValid: true,
        firstnameValid: true,
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.avatar !== prevState.avatar) {
      this.setState((state) => ({
        preview: state.avatar ? URL.createObjectURL(state.avatar) : null,
      }));
    }

    if (this.props.user !== prevProps.user) {
      const { user } = this.props;
      this.setState({
        login: user.login,
        email: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        about: user.about,
      });
    }
  }

  handleImgChange(event) {
    this.setState({
      avatar: event.target.files[0],
    });
  }

  handlePassword(event) {
    this.setState({
      password: event.target.value,
    });
  }

  handlePasswordConfirm(event) {
    this.setState({
      passwordConfirm: event.target.value,
    });
  }

  checkRequiredFields() {
    this.setState((state) => ({
      firstnameValid: state.firstnameValid === null ? false : state.firstnameValid,
      loginValid: state.loginValid === null ? false : state.loginValid,
      emailValid: state.emailValid === null ? false : state.emailValid,
      passwordValid: state.passwordValid === null ? false : state.passwordValid,
      passwordConfirmValid:
        state.passwordConfirmValid === null ? false : state.passwordConfirmValid,
    }));

    return (
      !this.state.firstnameValid
      || !this.state.loginValid
      || !this.state.emailValid
      || !this.state.passwordValid
      || !this.state.passwordConfirmValid
    );
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
      const formData = new FormData();

      if (this.props.isNew) {
        formData.append('avatar', this.state.avatar);
        formData.append('login', this.state.login);
        formData.append('email', this.state.email);
        formData.append('password', this.state.password);
        formData.append('firstname', this.state.firstname);
        formData.append('lastname', this.state.lastname);
        formData.append('about', this.state.about);

        const response = await api.post('/users', formData);
        const { data } = response.data;
        const { user, token } = data;

        localStorage.setItem('user_id', user.id);
        localStorage.setItem('token', token);
        this.props.onShowMessage({
          showMessageType: 'success',
          showMessageText: `Deu tudo certo!!!
                    Seja Bem-Vindo ${this.state.firstname}`,
        });

        this.props.history.push('/');
        return;
      }

      if (this.state.avatar) {
        formData.append('avatar', this.state.avatar);
      } else {
        formData.append('avatar', this.props.user.avatar);
      }
      formData.append('login', this.state.login);
      formData.append('email', this.state.email);
      formData.append('firstname', this.state.firstname);
      formData.append('lastname', this.state.lastname);
      formData.append('about', this.state.about);

      const response = await api.put(`/users/${this.userId}`, formData, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      });

      const { data } = response.data;
      const { user } = data;

      this.props.onShowMessage({
        showMessageType: 'success',
        showMessageText: `${this.state.firstname} seu cadastro foi alterado com sucesso`,
      });
      this.props.onUpdateDataUser(user);
      this.props.onCloseUserForm();
    } catch (error) {
      const { detail, data } = error.response.data;
      if (data) {
        const { name, errors = [] } = data;
        if (name && name.search('ValidationError') >= 0) {
          let messages = `Precisa corrigir algumas coisas:
                    `;
          errors.forEach((errorValidation) => {
            messages = `${messages}
                        > ${errorValidation.message}`;
            this.setState((state) => ({
              loginValid:
                errorValidation.path === 'login' ? false : state.loginValid,
              login: errorValidation.path === 'login' ? '' : state.login,
              emailValid:
                errorValidation.path === 'email' ? false : state.emailValid,
              email: errorValidation.path === 'email' ? '' : state.email,
              firstnameValid:
                errorValidation.path === 'firstname'
                  ? false
                  : state.firstnameValid,
              firstname:
                errorValidation.path === 'firstname' ? '' : state.firstname,
            }));
          });
          this.props.onShowMessage({
            showMessageType: 'error',
            showMessageText: messages,
            showMessageTextAlign: 'text-left',
          });
          return;
        }
      }
      this.props.onShowMessage({
        showMessageType: 'error',
        showMessageText: detail,
      });
    }
  }

  handleCancel() {
    if (this.props.isNew) {
      if (this.props.onRegisterClose) {
        this.props.onRegisterClose();
      }
      return;
    }
    this.props.onCloseUserForm();
  }

  render() {
    return (
      <div
        className={`
                    user-form background-primary b-secondary
                    ${this.props.isVisible ? 'show user-form-move' : 'hide'}
                `}
      >
        <h1>{this.props.title}</h1>
        <form onSubmit={this.handleSubmit}>
          <label
            id="avatar"
            className={`
                            ${
                              this.state.avatar
                                ? 'b-secondary'
                                : 'b-dashed-secondary'
                            }
                        `}
            style={{
              backgroundImage: `url(${this.state.preview})`,
            }}
          >
            <Input type="file" onChange={this.handleImgChange} />
            <img
              src={camera}
              alt="Selecione uma Imagem"
              style={{
                display: this.state.avatar ? 'none' : '',
              }}
            />
          </label>
          <Input
            type="text"
            placeholder="Crie um Login"
            value={this.state.login}
            onChange={(event) => {
              this.setState({ login: event.target.value });
            }}
            isValid={this.state.loginValid}
            onIsValid={(loginValid) => {
              this.setState({ loginValid });
            }}
            isRequired
          />
          <Input
            type="text"
            placeholder="Seu melhor email"
            value={this.state.email}
            onChange={(event) => {
              this.setState({ email: event.target.value });
            }}
            isValid={this.state.emailValid}
            onIsValid={(emailValid) => {
              this.setState({ emailValid });
            }}
            isRequired
          />
          <Input
            type="text"
            placeholder="Seu Nome"
            value={this.state.firstname}
            onChange={(event) => {
              this.setState({ firstname: event.target.value });
            }}
            isValid={this.state.firstnameValid}
            onIsValid={(firstnameValid) => {
              this.setState({ firstnameValid });
            }}
            isRequired
          />
          <Input
            type="text"
            placeholder="Seu Sobrenome"
            value={this.state.lastname}
            onChange={(event) => {
              this.setState({ lastname: event.target.value });
            }}
            isVisible={!this.props.isNew}
          />
          <Input
            type="password"
            placeholder="Crie uma Senha"
            value={this.state.password}
            onChange={this.handlePassword}
            isValid={this.state.passwordValid}
            onIsValid={(passwordValid) => {
              this.setState({ passwordValid });
            }}
            isVisible={this.props.isNew}
            isRequired={this.props.isNew}
          />
          <Input
            type="password"
            placeholder="Confirme a Senha"
            value={this.state.passwordConfirm}
            onChange={this.handlePasswordConfirm}
            isValid={this.state.passwordConfirmValid}
            onIsValid={(passwordConfirmValid) => {
              this.setState({ passwordConfirmValid });
            }}
            isVisible={this.props.isNew}
            isRequired={this.props.isNew}
          />
          <textarea
            className={this.props.isNew ? 'hide' : ''}
            rows="3"
            placeholder="Fale sobre você"
            value={this.state.about}
            onChange={(event) => {
              this.setState({ about: event.target.value });
            }}
          />
          <Button type="submit">{this.props.buttonDescription}</Button>
        </form>
        <Button onClick={this.handleCancel}>Cancelar</Button>
      </div>
    );
  }
}

UserForm.defaultProps = {
  title: 'Cadastre-se',
  buttonDescription: 'Cadastrar',
  isNew: true,
  isVisible: true,
};

export default UserForm;
