import React from 'react';
import api from '../../services/api';

import imgLupaBusca from '../../assets/img/lupa_busca.jpg';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleActive = this.handleActive.bind(this);
    this.state = {
      active: this.props.active,
      searchText: '',
    };
  }

  async handleSearch(event) {
    this.setState({
      searchText: event.target.value,
    });

    const response = await api.get(
      `${this.props.route}?search=${event.target.value}`,
      {
        ...this.props.dataSearch,
      },
    );

    const { data } = response.data;

    if (this.props.onSearch) {
      this.props.onSearch(event, data);
    }
  }

  handleActive() {
    this.setState({
      active: true,
    });
  }

  render() {
    if (this.state.active) {
      return (
        <div className="search-container">
          <input
            type="text"
            placeholder={this.props.placeholder}
            value={this.state.searchText}
            onChange={(e) => this.handleSearch(e)}
          />
        </div>
      );
    }

    return (
      <div
        className="search-container button"
        onClick={() => this.handleActive()}
        onKeyPress={() => this.handleActive()}
        role="button"
        tabIndex={0}
      >
        <img
          src={imgLupaBusca}
          alt={this.props.placeholder}
          title={this.props.placeholder}
        />
      </div>
    );
  }
}

SearchBar.defaultProps = {
  active: false,
  placeholder: 'Procurar...',
  dataSearch: {},
};

export default SearchBar;
