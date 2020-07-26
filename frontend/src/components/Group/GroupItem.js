import React, { Component } from 'react';

import './GroupItem.css';

export default class GroupItem extends Component {
  render() {
    return (
      <div className="group-container item b-primary">
        <strong>{this.props.group.name}</strong>
      </div>
    );
  }
}
