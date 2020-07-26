/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import api from '../../services/api';

import UserForm from '../UserForm/UserForm';

import './UserInfo.css';

class UserInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      userFormActive: false,
    };
  }

  async componentDidMount() {
    if (this.state.user.id) {
      return;
    }
    this.userId = localStorage.getItem('user_id');
    this.token = localStorage.getItem('token');

    this.response = await api.get(`/users/${this.userId}`, {
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
    });

    const { data: user } = this.response.data;

    this.setState({
      user,
    });
  }

  handleOpenCloseUserForm() {
    if (!this.props.preview) {
      this.setState((state) => ({
        userFormActive: !state.userFormActive,
      }));
    }
  }

  render() {
    const { user } = this.state;
    const { preview } = this.props;
    return (
      <div
        className={`
                    container-inline
                    userinfo-container
                    background-secondary
                    ${preview ? 'preview' : ''}
                `}
      >
        <div className={`container info ${this.state.userFormActive ? 'hide' : 'show'}`}>
          <h3>{user.firstname}</h3>
          <p>{user.email}</p>
          <p>{user.about}</p>
        </div>
        <img
          className={this.state.userFormActive ? 'hide' : 'show'}
          src={user.avatar ? user.avatar : ''}
          alt=""
          role="button"
          onClick={() => this.handleOpenCloseUserForm()}
          onKeyPress={() => this.handleOpenCloseUserForm()}
        />
        <UserForm
          title="Alterar Dados"
          buttonDescription="Salvar"
          isNew={false}
          isVisible={this.state.userFormActive}
          user={user}
          onCloseUserForm={() => this.handleOpenCloseUserForm()}
          onShowMessage={(message) => this.props.onShowMessage(message)}
          onUpdateDataUser={(userUpdated) => this.setState({ user: userUpdated })}
        />
      </div>
    );
  }
}

UserInfo.defaultProps = {
  user: {},
};

export default UserInfo;
