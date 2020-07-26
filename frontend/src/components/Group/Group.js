import React, { Component } from 'react';

import GroupList from './GroupList';
import Button from '../Form/Button/Button';

import './Group.css';

export default class Group extends Component {
  constructor(props) {
    super(props);

    this.state = {
      myGroup: true,
    };
  }

  componentDidMount() {
    this.userId = localStorage.getItem('user_id');
    this.token = localStorage.getItem('token');
  }

  handleMyGroup() {
    this.setState({
      myGroup: true,
    });
  }

  handleAllGroups() {
    this.setState({
      myGroup: false,
    });
  }

  render() {
    if (this.props.active) {
      return (
        <>
          <div className="container group-menu-container">
            <Button>Criar grupo</Button>
            <Button
              onClick={() => this.handleMyGroup()}
              isVisible={!this.state.myGroup}
            >
              Ver meus grupos
            </Button>
            <Button
              onClick={() => this.handleAllGroups()}
              isVisible={this.state.myGroup}
            >
              Ver todos grupos
            </Button>
          </div>
          <GroupList
            myGroup={this.state.myGroup}
            onShowMessage={this.handleShowMessage}
          />
        </>
      );
    }

    return null;
  }
}
