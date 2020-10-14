import * as React from 'react';
import DatePicker from 'react-datepicker';
import B24 from '../../B24';
import Select from 'react-select';
import './FormFields.css';
import { dateConverter } from '../../helpers';

const selected = (date: string) =>
  date ? new Date(dateConverter(date)) : null;

const PickDate = (props: any) => (
  <div>
    <span className="mx-2">{props.label}</span>
    <div className="form-group mx-2">
      <DatePicker
        className="form-control"
        disabled={props.disabled}
        selected={selected(props.date)}
        dateFormat="dd.MM.yyyy"
        onChange={props.handleChange}
      />
    </div>
  </div>
);

const BaseInput = (props: {
  required?: boolean;
  className?: string;
  label: string;
  type?: string;
  placeholder?: string;
  id: string;
  value: string;
  handleChange: (e: React.SyntheticEvent) => void;
}) => (
  <div className={`${props.className ? props.className : ''}`}>
    <div className="form-group">
      {props.label}
      <input
        type={props.type || 'text'}
        required={props.required !== undefined ? props.required : true}
        className="form-control"
        placeholder={props.placeholder}
        id={props.id}
        value={props.value}
        onChange={props.handleChange}
      />
    </div>
  </div>
);

const Price: React.FunctionComponent<{
  id: string;
  value: string;
  label: string;
  handleChange: (e: any) => void;
}> = (props) => (
  <div className="form-group">
    {props.label}
    <div className="input-group">
      <div className="input-group-prepend">
        <span className="input-group-text">€</span>
      </div>
      <input
        type="number"
        className="form-control"
        id={props.id}
        value={props.value}
        onChange={props.handleChange}
      />
    </div>
  </div>
);

const Paid = (props: any) => (
  <div className="form-group mx-2">
    Payment Date
    <div className="input-group">
      <div className="input-group-prepend">
        <div className="input-group-text">
          <input
            type="checkbox"
            id={props.id}
            onChange={props.handleCheckboxChange}
            checked={props.checkboxState}
          />
        </div>
      </div>
      <DatePicker
        className="form-control"
        disabled={!props.checkboxState}
        selected={selected(props.date)}
        dateFormat="dd.MM.yyyy"
        onChange={props.handleChange}
      />
    </div>
  </div>
);

const Pi = (props: any) => (
  <div className="form-group">
    Proforma Received
    <div className="input-group">
      <div className="input-group-prepend">
        <div className="input-group-text">
          <input
            type="checkbox"
            id={props.id}
            onChange={props.handleCheckboxChange}
            checked={props.proformaReceivedDate}
          />
        </div>
      </div>
      <DatePicker
        className="form-control"
        disabled={!props.checkboxState}
        selected={selected(props.date)}
        dateFormat="dd.MM.yyyy"
        onChange={props.handleDateChange}
        placeholderText={props.checkboxState && 'Receiving date'}
        todayButton={'Today'}
      />
      <input
        type="text"
        className="form-control"
        disabled={!props.checkboxState}
        onChange={props.handleNumberChange}
        placeholder={props.checkboxState && '#'}
        id={props.numberId}
        value={props.number}
      />
    </div>
  </div>
);

interface ArticleProps {
  options: any[];
  value: any;
  handleSlaveChange: (product: string, code: string, brand: string) => void;
  handleChange: (a: any) => void;
}

class Article extends React.Component<ArticleProps> {
  formatGroupLabel = (data: any) => (
    <div className="Article_groupStyles">
      <span>{data.label}</span>
      <span className="Article_groupBadgeStyles">{data.options.length}</span>
    </div>
  );

  onChange = async ({ value, label }: { value: any; label: any }) => {
    const brand_map: {
      [key: number]: string;
    } = {
      8568: 'XMF',
      8574: 'XMT',
      8572: 'XMS',
    };

    this.props.handleChange({ value, label });
    const {
      PROPERTY_386,
      PROPERTY_384,
      PROPERTY_380,
      SECTION_ID,
    } = await B24.get_product(value);
    const product = `${PROPERTY_386.value || ''}, ${PROPERTY_384.value || ''}`;
    const code = PROPERTY_380.value || '';
    const brand = brand_map[SECTION_ID] || '';
    this.props.handleSlaveChange(product, code, brand);
  };

  render = () => (
    <>
      Article
      <Select
        value={this.props.value}
        // @ts-ignore
        onChange={this.onChange}
        options={this.props.options}
        formatGroupLabel={this.formatGroupLabel}
      />
    </>
  );
}

export { PickDate, BaseInput, Article, Price, Paid, Pi };
