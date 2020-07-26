import React, { Component } from 'react';

import GroupItem from './GroupItem';

import api from '../../services/api';

export default class GroupList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groups: [],
    };
  }

  componentDidMount() {
    this.userId = localStorage.getItem('user_id');
    this.token = localStorage.getItem('token');

    this.loadGroups();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.myGroup !== this.props.myGroup) {
      this.loadGroups();
    }
  }

  async loadGroups() {
    try {
      const response = await api(
        this.props.myGroup ? `/users/${this.userId}/manager-groups` : '/groups',
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        },
      );

      const { data: groups } = response.data;

      this.setState({
        groups,
      });
    } catch (error) {
      const { detail } = error.response.data;
      if (this.props.onShowMessage) {
        this.props.onShowMessage({
          showMessageType: 'error',
          showMessageText: `${detail}`,
        });
      }
    }
  }

  render() {
    if (this.state.groups.length) {
      return (
        <div className="container group-container background-quaternary b-secondary">
          {this.props.myGroup ? (
            <strong>Meu(s) Grupo(s)</strong>
          ) : (
            <strong>Todos Grupos</strong>
          )}
          {this.state.groups.map((group) => (
            <GroupItem key={group.id} group={group} />
          ))}
        </div>
      );
    }

    if (this.props.myGroup) {
      return (
        <div className="container group-container background-quaternary b-secondary">
          <strong>
            Você não esta em nenhum grupo. Crie o seu grupo ou entre em algum
            grupo
          </strong>
        </div>
      );
    }

    return (
      <div className="container group-container background-quaternary b-secondary">
        <strong>Nenhum grupo encontrado. Crie o primeiro grupo.</strong>
      </div>
    );
  }
}
