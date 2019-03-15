import React from 'react';
import DatePicker from "react-datepicker";
import B24 from '../../B24';
import Select from 'react-select';
import './FormFields.css';

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
    Price
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
    Payment Date
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

const Pi = props =>
  <div className="form-group">
    Proforma Received
    <div className="input-group">
      <div className="input-group-prepend">
        <div className="input-group-text">
          <input type='checkbox' id={props.id} onChange={props.handleCheckboxChange} checked={props.proformaReceivedDate}/>
        </div>
      </div>
      <DatePicker className="form-control" disabled={!props.checkboxState}
        selected={
          props.date
          ? new Date(props.date)
          : null
        }
        dateFormat="dd.MM.yyyy"
        onChange={props.handleDateChange}
        placeholderText={props.checkboxState ? 'Receiving date' : ''}
        todayButton={"Today"}
      />
      <input type="text" className="form-control"
        disabled={!props.checkboxState}
        onChange={props.handleNumberChange}
        placeholder={props.checkboxState ? '#' : ''}
        id={props.numberId} value={props.number}
        required
      />
    </div>
  </div>

const SecondPayment = props => {
    return <div className="form-group">
      Payment #2
      <button type="button" className="btn btn-sm btn-block btn-light form-control SecondPayment_button" data-toggle="modal" data-target="#secondPayment">
        show
      </button>
      <div className="modal fade" id="secondPayment" tabIndex="-1" role="dialog" aria-labelledby="secondPaymentLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="secondPaymentLabel">Second payment</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col">
                  {props.children[0]}
                </div>
                <div className="col-auto">
                  {props.children[1]}
                </div>
              </div>
                {props.children[2]}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-dismiss="modal">Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
}

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
    <div className="Article_groupStyles">
      <span>{data.label}</span>
      <span className="Article_groupBadgeStyles">{data.options.length}</span>
    </div>
  );

  onChange = async e => {
    let product = await B24.get_product(e.value);
    this.props.handleSlaveChange(
      `${ product[this.prop_map.product] ? product[this.prop_map.product].value : '' }, ${ product[this.prop_map.weight] ? product[this.prop_map.weight].value : '' }`,
      product[this.prop_map.code] ? product[this.prop_map.code].value : '',
      this.brand_map[ product[this.prop_map.brand] ]
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

export { PickDate, BaseInput, Article, Price, Paid, Pi, SecondPayment };