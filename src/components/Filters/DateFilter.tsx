import DatePicker from 'react-datepicker';
import { changeStartDate, changeEndDate } from 'store/slices/mainSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import dayjs from 'dayjs';

function PreDefinedDates() {
  const periods = ['1 year', '6 months', '3 months', '1 month'] as const;
  const makeRange = (period: typeof periods[number]): [string, string] => {
    const [amount, unit] = period.split(' ');
    const startDate = dayjs()
      .subtract(+amount, unit)
      .add(1, 'day')
      .toISOString();
    return [startDate, new Date().toISOString()];
  };

  const dispatch = useAppDispatch();
  return (
    <>
      {periods.map((period) => (
        <button
          key={period}
          type="button"
          onClick={() => {
            const [sDate, eDate] = makeRange(period);
            dispatch(changeStartDate(sDate));
            dispatch(changeEndDate(eDate));
          }}
          className="ml-1 btn btn-primary btn-sm"
        >
          {period}
        </button>
      ))}
    </>
  );
}

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
      <span className="mx-1"></span>
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
        todayButton="Today"
      />
      <PreDefinedDates />
    </div>
  );
}

export default DateFilter;
