import DatePicker from 'react-datepicker';
import { changeStartDate, changeEndDate } from 'store/slices/mainSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';

function DateFilter() {
  const dispatch = useAppDispatch();
  const startDate: Date | undefined = useAppSelector(
    ({ main: { startDate } }) => {
      if (startDate) return new Date(startDate);
    }
  );
  const endDate: Date | undefined = useAppSelector(({ main: { endDate } }) =>
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
    </div>
  );
}

export default DateFilter;
