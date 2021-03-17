import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Button } from 'tabler-react';

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
        className="form-control"
        selected={startDate}
        dateFormat="dd.MM.yy"
        selectsStart
        startDate={startDate}
        endDate={endDate}
        onChange={(date: Date) => setStartDate(date)}
        placeholderText="from"
        maxDate={endDate}
      />
      <DatePicker
        className="form-control"
        selected={endDate}
        dateFormat="dd.MM.yy"
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        onChange={(date: Date) => setEndDate(date)}
        placeholderText="to"
        minDate={startDate}
      />
      <div className="px-1">
        <Button
          color="info"
          pill
          onClick={() => props.update({ startDate, endDate })}
        >
          Apply Dates
        </Button>
      </div>
    </div>
  );
}

export { DateFilter };
