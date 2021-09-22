import { Component } from 'react';

class BrandFilter extends Component<{
  update: any;
}> {
  state: {
    [key: string]: boolean;
  } = {
    XMT: true,
    XMS: true,
    XMF: true,
    'No brand': false,
  };

  getActiveBrands = () =>
    Object.keys(this.state).filter((brand) => this.state[brand]);

  handleChange = (e: any) => {
    e.stopPropagation();
    this.setState(
      {
        [e.currentTarget.value]: e.currentTarget.checked,
      },
      () => this.props.update({ activeBrands: this.getActiveBrands() })
    );
  };

  render = () => (
    <div className="d-flex align-items-start">
      <div className="btn-group" data-toggle="buttons">
        {Object.keys(this.state).map((brand) => (
          <label className="btn btn-secondary" key={brand}>
            <input
              type="checkbox"
              value={brand}
              checked={this.state[brand]}
              onChange={this.handleChange}
            />{' '}
            {brand}
          </label>
        ))}
      </div>
    </div>
  );
}

export { BrandFilter };
