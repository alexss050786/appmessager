import React, { Component } from 'react';

import Button from '../Form/Button/Button';

import './MenuContactGroup.css';

export default class MenuContactGroup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      active: false,
      contactActive: true,
      contactNotConfirmedActive: false,
      groupActive: false,
    };
  }

  handleContactClick(event) {
    this.setState({
      contactActive: true,
      contactNotConfirmedActive: false,
      groupActive: false,
      active: false,
    });

    if (this.props.onMenuContactClick) {
      this.props.onMenuContactClick(event);
    }
  }

  handleContactNotConfirmedClick(event) {
    this.setState({
      contactActive: false,
      contactNotConfirmedActive: true,
      groupActive: false,
      active: false,
    });

    if (this.props.onMenuContactNotConfirmedClick) {
      this.props.onMenuContactNotConfirmedClick(event);
    }
  }

  handleGroupClick(event) {
    this.setState({
      contactActive: false,
      contactNotConfirmedActive: false,
      groupActive: true,
      active: false,
    });

    if (this.props.onMenuGroupClick) {
      this.props.onMenuGroupClick(event);
    }
  }

  render() {
    return (
      <div className="container menucontactgroup-container">
        <Button
          className="button-option"
          onClick={() => {
            this.setState((state) => ({
              active: !state.active,
            }));
          }}
        >
          Opções
        </Button>
        <div
          className={`container menucontactgroup-container option  background-quaternary b-secondary ${
            this.state.active ? '' : 'hide'
          }`}
        >
          <div className="menucontactgroup-container option-item">
            <Button
              onClick={(event) => this.handleContactClick(event)}
              isVisible={this.state.active && !this.state.contactActive}
            >
              Contatos
            </Button>
            <Button
              onClick={(event) => this.handleContactNotConfirmedClick(event)}
              isVisible={
                this.state.active && !this.state.contactNotConfirmedActive
              }
            >
              Contatos não confirmados
            </Button>
            <Button
              title="Em breve"
              onClick={(event) => this.handleGroupClick(event)}
              isVisible={this.state.active && !this.state.groupActive}
              disabled
            >
              Grupos
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
