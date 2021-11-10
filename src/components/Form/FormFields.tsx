import * as React from 'react';
import DatePicker from 'react-datepicker';
import * as B24 from '../../B24/B24';
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
  value?: string;
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

interface SerialNumberProps {
  serialNumber: string;
  handleChange: any;
}

const SerialNumber = (props: SerialNumberProps) => (
  <>
    Serial number:
    <input
      required
      className="form-control"
      type="text"
      id="serialNumber"
      placeholder="Loading ..."
      value={props.serialNumber}
      onChange={props.handleChange}
    />
  </>
);

interface PriceProps {
  value: string;
  label: string;
  handleChange: (value: string) => void;
}

function Price({ value, label, handleChange }: PriceProps) {
  return (
    <div className="form-group">
      {label}
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">€</span>
        </div>
        <input
          type="number"
          className="form-control"
          value={value}
          onChange={({ currentTarget }) => {
            currentTarget.value.replace(',', '.');
            handleChange(currentTarget.value);
          }}
        />
      </div>
    </div>
  );
}

interface QuoteProps {
  activeQuoteNo?: boolean;
  handleActiveQuoteNoChange: (e: React.SyntheticEvent) => void;
  value: string;
  label: string;
  onChange: (e: React.SyntheticEvent) => void;
}

function QuoteNo({
  value,
  label,
  onChange,
  activeQuoteNo,
  handleActiveQuoteNoChange,
}: QuoteProps) {
  return (
    <div className="form-group">
      {label}
      <div className="input-group">
        <div className="input-group-prepend">
          <div className="input-group-text">
            <input
              checked={activeQuoteNo}
              type="radio"
              name="shippingLabelOF"
              aria-label="Radio choose for shipping label"
              onChange={handleActiveQuoteNoChange}
            />
          </div>
        </div>
        <input
          type="text"
          className="form-control"
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

interface PaidProps {
  checked: boolean;
  onChange: (e: React.BaseSyntheticEvent) => void;
  paymentDateChange: (e: Date) => void;
  paymentDate: string;
}

const Paid = ({
  checked,
  onChange,
  paymentDateChange,
  paymentDate,
}: PaidProps) => {
  return (
    <div className="form-group mx-2">
      Payment Date
      <div className="input-group">
        <div className="input-group-prepend">
          <div className="input-group-text">
            <input type="checkbox" onChange={onChange} checked={checked} />
          </div>
        </div>
        <DatePicker
          className="form-control"
          disabled={!checked}
          selected={selected(paymentDate)}
          dateFormat="dd.MM.yyyy"
          onChange={paymentDateChange}
        />
      </div>
    </div>
  );
};

// const Pi = (props: any) => (
//   <div className="form-group">
//     Proforma Received
//     <div className="input-group">
//       <div className="input-group-prepend">
//         <div className="input-group-text">
//           <input
//             type="checkbox"
//             id={props.id}
//             onChange={props.handleCheckboxChange}
//             checked={props.proformaReceivedDate}
//           />
//         </div>
//       </div>
//       <DatePicker
//         className="form-control"
//         disabled={!props.checkboxState}
//         selected={selected(props.date)}
//         dateFormat="dd.MM.yyyy"
//         onChange={props.handleDateChange}
//         todayButton={'Today'}
//       />
//       <input
//         type="text"
//         className="form-control"
//         disabled={!props.checkboxState}
//         onChange={props.handleNumberChange}
//         id={props.numberId}
//         value={props.number}
//       />
//     </div>
//   </div>
// );

interface ArticleProps {
  options: any[];
  value: any;
  handleSlaveChange: (
    product: string,
    code: string,
    brand: string,
    colour: string
  ) => void;
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
    let {
      PROPERTY_420,
      PROPERTY_384,
      PROPERTY_380,
      PROPERTY_482,
      SECTION_ID,
    } = await B24.get_product(value);
    const product = `${PROPERTY_420?.value ?? ''}, ${
      PROPERTY_384?.value ?? ''
    }`;
    const code = PROPERTY_380?.value || '';
    const brand = brand_map[SECTION_ID] || '';
    const colour = PROPERTY_482 ? PROPERTY_482.value : '';
    this.props.handleSlaveChange(product, code, brand, colour);
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

export { PickDate, BaseInput, SerialNumber, Article, Price, Paid, QuoteNo };
