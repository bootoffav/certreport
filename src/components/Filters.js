import React from 'react';


class FabricSearch extends React.Component {
  state = {
    value: ''
  };
  onChange = (e) => {
    this.setState({ value: e.target.value });
    this.props.filter(e.target.value);
  };

  render() {
    return (
      <input type="text" className="form-control" placeholder="fabric search"
        onChange={this.onChange} value={this.state.value}/>
    )
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

export { FabricSearch, BrandFilter };