import DatePicker from 'react-datepicker';
import { dateConverter } from 'helpers';

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
          selected={paymentDate ? new Date(dateConverter(paymentDate)) : null}
          dateFormat="dd.MM.yyyy"
          onChange={paymentDateChange}
        />
      </div>
    </div>
  );
};

export default Paid;
