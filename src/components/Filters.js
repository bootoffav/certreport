import React from 'react';


class ColumnSearch extends React.Component {
  state = {
    value: '',
    searchingColumn: 'article'
  };
  onChange = (e) => {
    this.setState({ value: e.target.value });
    this.props.filter(e.target.value, this.state.searchingColumn);
  };

  changeColumn = (e, value) => {
    document.getElementById('columnSearch').innerText = e.target.innerText;
    this.setState({ searchingColumn: value })
  };

  render() {
    return (
      <div className="input-group">
        <input type="text" className="form-control" placeholder="search"
          onChange={this.onChange} value={this.state.value}/>
        <div className="input-group-append">
          <button className="btn btn-outline-success dropdown-toggle" id="columnSearch" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Fabric</button>
          <div className="dropdown-menu">
            <button className="dropdown-item"
              onClick={e => this.changeColumn(e, 'TITLE')}
            >Task name</button>
            <button className="dropdown-item"
              onClick={e => this.changeColumn(e, 'testReport')}
              >Test report</button>
            <button className="dropdown-item"
              onClick={e => this.changeColumn(e, 'certificate')}
              >Certificate</button>
            {/* <button className="dropdown-item"
              onClick={e => this.changeColumn(e, 'standards')}
            >Standards</button> */}
            <button className="dropdown-item"
              onClick={e => this.changeColumn(e, 'article')}
            >Fabric</button>
          </div>
        </div>
    </div>);
  }
}

class BrandFilter extends React.Component {
  render() {
    return <div className="d-flex filter-level-1">
      <div className="dropdown">
        <button className="btn btn-success dropdown-toggle" type="button" id="brandFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Brand: All
        </button>
        <div className="dropdown-menu">
          <button className="dropdown-item" type="button" onClick={e => this.props.filter('All')}>All</button>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item" type="button" onClick={e => this.props.filter('XMT')}>XMT</button>
          <button className="dropdown-item" type="button" onClick={e => this.props.filter('XMS')}>XMS</button>
          <button className="dropdown-item" type="button" onClick={e => this.props.filter('XMF')}>XMF</button>
          <div className="dropdown-divider"></div>
          <button className="dropdown-item" type="button" onClick={e => this.props.filter('No brand')}>No brand</button>
        </div>
      </div>
    </div>
  }
}

export { ColumnSearch, BrandFilter };