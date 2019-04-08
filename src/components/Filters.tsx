import React, { DOMElement } from 'react';


class ColumnSearch extends React.Component {
  props : {
    filter: (columnToSeach: string, valueToSearch: string) => void
  };
  state : {
    value: string;
    searchingColumn : string;
  }

  constructor(props : any) {
    super(props);
    this.props = props;
    this.state = {
      value: '',
      searchingColumn: 'article'
    };

  }
  onChange = (e : any) => {
    this.setState({ value: e.target.value });
    this.props.filter(e.target.value, this.state.searchingColumn);
  };

  changeColumn = (e : any, value :string) => {
    let columnSearch : HTMLElement | null = document.getElementById('columnSearch');
    if (columnSearch !== null) {
      columnSearch.innerText = e.target.innerText;
    }
    
    this.setState({ searchingColumn: value })
  };

  render() {
    return (
      <div className="pl-1 input-group">
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
            <button className="dropdown-item"
              onClick={e => this.changeColumn(e, 'standards')}
            >Standards</button>
            <button className="dropdown-item"
              onClick={e => this.changeColumn(e, 'article')}
            >Fabric</button>
          </div>
        </div>
    </div>);
  }
}

class BrandFilter extends React.Component {
  props : {
    filter: (brand : string) => void
  }

  constructor(props : any) {
    super(props);
    this.props = props;
  }

  render() {
    return <div className="d-flex">
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