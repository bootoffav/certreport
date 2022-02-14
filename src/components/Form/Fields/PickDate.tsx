import { dateConverter } from 'helpers';
import DatePicker from 'react-datepicker';

type PickDateProps = {
  date: string;
  label: string;
  disabled?: boolean;
  handleChange: any;
};

const PickDate = ({ disabled, label, date, handleChange }: PickDateProps) => {
  return (
    <div>
      <span className="mx-2">{label}</span>
      <div className="form-group mx-2">
        <DatePicker
          className="form-control"
          disabled={disabled}
          selected={date ? new Date(dateConverter(date)) : null}
          dateFormat="dd.MM.yyyy"
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default PickDate;
