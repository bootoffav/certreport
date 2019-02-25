import React from 'react';
import DatePicker from "react-datepicker";
import B24 from '../../B24';
import Select from 'react-select';
import { select_options } from './Form';

const PickDate = props =>
  <div className="col">
    {props.label}
    <div className="form-group">
      <DatePicker className="form-control" disabled={props.disabled}
        selected={
          props.date
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
      <input type={props.type || 'text' } required className="form-control"
        placeholder={props.placeholder} id={props.id} value={props.value} onChange={props.handleChange}/>
    </div>
  </div>

const Price = props =>
  <div className="form-group">
    {props.label}
    <div className="input-group">
      <div className="input-group-prepend">
        <span className="input-group-text">€</span>
      </div>
      <input type="text" className="form-control" required
        id={props.id}
        value={props.value}
        onChange={props.handleChange}
        />
    </div>
  </div>

const Paid = props =>
  <div className="form-group">
    {props.label}
    <div className="input-group">
      <div className="input-group-prepend">
        <div className="input-group-text">
          <input type='checkbox' id={props.id} onChange={props.handleCheckboxChange} checked={props.paymentDate}/>
        </div>
      </div>
      <DatePicker className="form-control" disabled={!props.checkboxState}
        selected={
          props.paymentDate
          ? new Date(props.paymentDate)
          : null
        }
        dateFormat="dd.MM.yyyy"
        onChange={props.handleChange}
      />
    </div>
  </div>

class Article extends React.Component {
  prop_map = {
    code: 'PROPERTY_380',
    weight: 'PROPERTY_384',
    product: 'PROPERTY_386',
    brand: 'SECTION_ID'
  };

  brand_map = {
    8568: 'XMF',
    8574: 'XMT',
    8572: 'XMS'
  };

  formatGroupLabel = data => (
    <div style={this.groupStyles}>
      <span>{data.label}</span>
      <span style={this.groupBadgeStyles}>{data.options.length}</span>
    </div>
  );

  groupStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  };
  
  groupBadgeStyles = {
    backgroundColor: "#EBECF0",
    borderRadius: "2em",
    color: "#172B4D",
    fontSize: 12,
    display: "inline-block",
    fontWeight: "bold",
    lineHeight: "1",
    minWidth: 1,
    padding: "0.16666666666667em 0.5em",
    textAlign: "center"
  };

  async componentDidMount() {
    // setTimeout(() => {
    //   if (this.props.value !== '') {
    //     let ind = select_options.articles.findIndex(el => el.label === this.props.value.label);
    //     this.setState({ 
    //       value: select_options.articles[ind]
    //     });
    //   }
    // }, 2000);
  }

  onChange = async e => {
    let product = await B24.get_product(e.value);
    this.props.handleSlaveChange(
      `${ product[this.prop_map.product] ? product[this.prop_map.product].value : '' }, ${ product[this.prop_map.weight] ? product[this.prop_map.weight].value : '' }`,
      product[this.prop_map.code] ? product[this.prop_map.code].value : '',
      [{
        value: select_options.brand.find(el => el.label === this.brand_map[ product[this.prop_map.brand] ]).value,
        label: this.brand_map[ product[this.prop_map.brand] ]
      }]
    );
    this.props.handleChange(e.label, 'article');
  }

  findCurrentValue = value => {
    let result;
    this.props.options.forEach(section => {
      let sectionResult = section.options.find(el => el.label === this.props.value);
      if (sectionResult) {
        result = sectionResult;
      }
    });
    return result;
  }

  render() {
    return (
    <div className={this.props.col || 'col'}>
      <div className="form-group">
      Article
      <Select value={this.findCurrentValue(this.props.value)}
        onChange={this.onChange}
        options={this.props.options}
        formatGroupLabel={this.formatGroupLabel}
      />
      </div>
    </div>);
  }
}

export { PickDate, BaseInput, Article, Price, Paid };