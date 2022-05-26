import DatePicker from 'react-datepicker';
import { changeStartDate, changeEndDate, RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';

function DateFilter() {
  const dispatch = useDispatch();
  const startDate: Date | undefined = useSelector(
    ({ main: { startDate } }: RootState) => {
      if (startDate) return new Date(startDate);
    }
  );
  const endDate: Date | undefined = useSelector(
    ({ main: { endDate } }: RootState) =>
      endDate ? new Date(endDate) : undefined
  );

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
        onChange={(date: Date | null) => {
          const payload = date ? date.toISOString() : null;
          dispatch(changeStartDate(payload));
        }}
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
        onChange={(date: Date | null) => {
          const payload = date ? date.toISOString() : null;
          dispatch(changeEndDate(payload));
        }}
        placeholderText="to"
        minDate={startDate}
      />
      {/* <div className="px-1">
        <button type="button" className="btn btn-primary btn-sm">
          Apply dates
        </button>
      </div> */}
    </div>
  );
}

export default DateFilter;
