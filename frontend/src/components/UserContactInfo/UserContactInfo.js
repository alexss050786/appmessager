import React from 'react';

import './UserContactInfo.css';

export default class UserContactInfo extends React.Component {
  render() {
    if (this.props.userContact.id) {
      const { user } = this.props.userContact;
      return (
        <div className="container usercontactinfo-container">
          <h5>Voçê está conversando com:</h5>
          <div className="container-inline">
            <img className="b-quarternary" src={user.avatar} alt="" />
            <div className="container info">
              <strong>{`${user.firstname} ${user.lastname}`}</strong>
              <p>{user.email}</p>
              <p>{user.about}</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container usercontactinfo-container empty">
        <h2>Converse com alguém :)</h2>
      </div>
    );
  }
}
