import React from 'react';
import DatePicker from "react-datepicker";
import B24 from './B24';
import Select from 'react-select';
import { select_options } from './Helpers';

const PickDate = props =>
  <div className="col">
    {props.label}
    <div className="form-group">
      <DatePicker className="form-control" required
        selected={
          props.date
          // ? props.date.toDate()
          ? new Date(props.date)
          : null
        }
        dateFormat="dd.MM.yyyy"
        onChange={props.handleChange}
      />
    </div>
  </div>

const BaseInput = props =>
  <div className={props.col || 'col'}>
    <div className="form-group">
      {props.label}
      <input required className="form-control"
        placeholder={props.placeholder} id={props.id} value={props.value} onChange={props.handleChange}/>
    </div>
  </div>


class Product extends React.Component {
  prop_map = {
    code: 'PROPERTY_380',
    brand: 'PROPERTY_382',
    weight: 'PROPERTY_384',
    article: 'PROPERTY_386'
  };

  brand_map = {
    164: 'XMF',
    166: 'XMG',
    168: 'XMS',
    170: 'XMT'
  };

  options = [];

  async componentDidMount() {
    let products = await B24.get_products();
    this.options = products.map(product => ({
      value: product.ID,
      label: product.NAME
    }));
  }
  render() {
    return (
    <div className={this.props.col || 'col'}>
      <div className="form-group">
      Product
      <Select value={this.props.value}
        onChange={
          async e => {
            let product = await B24.get_product(e.value);
            this.props.handleSlaveChange(
              product[this.prop_map.article].value,
              product[this.prop_map.code].value,
              // product[this.prop_map.weight].value,
              {
                value: select_options.brand.find(el => el.label === this.brand_map[ product[this.prop_map.brand].value ]).value,
                label: this.brand_map[ product[this.prop_map.brand].value ]
              }
            );
            this.props.handleChange(e, 'product');
          }
        }
        options={this.options}
      />
      </div>
    </div>);
  }
}

export { PickDate, BaseInput, Product };