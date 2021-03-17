import { useState } from 'react';
import DatePicker from 'react-datepicker';

interface DateFilterProps {
  startDate: any;
  endDate: any;
  update: any;
}

function DateFilter(props: DateFilterProps) {
  const [startDate, setStartDate] = useState(props.startDate);
  const [endDate, setEndDate] = useState(props.endDate);

  return (
    <div className="d-flex align-items-center">
      <DatePicker
        selected={startDate}
        dateFormat="dd.MM.yy"
        selectsStart
        isClearable
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        startDate={startDate}
        endDate={endDate}
        onChange={(date: Date) => setStartDate(date)}
        placeholderText="from"
        maxDate={endDate}
      />
      <DatePicker
        selected={endDate}
        dateFormat="dd.MM.yy"
        selectsEnd
        isClearable
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        startDate={startDate}
        endDate={endDate}
        onChange={(date: Date) => setEndDate(date)}
        placeholderText="to"
        minDate={startDate}
      />
      <div className="px-1">
        <button
          type="button"
          onClick={() => props.update({ startDate, endDate })}
          className="btn btn-primary btn-sm"
        >
          Apply dates
        </button>
      </div>
    </div>
  );
}

export { DateFilter };
