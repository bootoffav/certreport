import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  changeActiveTestingCompanies,
  IInitialState,
} from '../../store/slices/mainSlice';

function TestingCompanyFilter() {
  const dispatch = useAppDispatch();
  const activeTestingCompanies = useAppSelector(
    ({ main }) => main.activeTestingCompanies
  );

  const handleChange = ({ target }: React.SyntheticEvent) => {
    const { value: testingCompany, checked } = target as unknown as {
      value: IInitialState['activeTestingCompanies'][number];
      checked: boolean;
    };
    dispatch(
      changeActiveTestingCompanies({
        testingCompany,
        checked,
      })
    );
  };

  return (
    <div className="d-flex align-items-start">
      <div className="btn-group btn-group-sm" data-toggle="buttons">
        {(['aitex', 'bttg', 'satra', 'all'] as const).map((item) => (
          <label
            className={`btn btn-${item === 'all' ? 'info' : 'secondary'}`}
            key={item}
          >
            <input
              type="checkbox"
              value={item}
              checked={activeTestingCompanies.includes(item)}
              onChange={handleChange}
            />{' '}
            {item.toUpperCase()}
          </label>
        ))}
      </div>
    </div>
  );
}

export default TestingCompanyFilter;
