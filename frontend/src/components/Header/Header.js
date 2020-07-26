import React from 'react';

import api from '../../services/api';
import UserInfo from '../UserInfo/UserInfo';
import UserContactInfo from '../UserContactInfo/UserContactInfo';

import './Header.css';

export default class Header extends React.Component {
  componentDidMount() {
    this.props.socket.on('logout', () => {
      this.handleLogout();
    });
  }

  async handleLogout() {
    await api.delete(`/users/${localStorage.getItem('user_id')}/session`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    localStorage.removeItem('user_id');
    localStorage.removeItem('token');

    this.props.history.push('/login');
  }

  render() {
    return (
      <div className="container-row-column header-container background-quaternary b-secondary">
        <div className="container usercontact-info background-secondary">
          <UserContactInfo userContact={this.props.userContact} />
        </div>
        <div className="container container-inline user-info background-secondary">
          <UserInfo
            onShowMessage={(message) => this.props.onShowMessage(message)}
          />
        </div>

        <button type="button" id="logout" onClick={() => this.handleLogout()}>
          Sair
        </button>
      </div>
    );
  }
}
