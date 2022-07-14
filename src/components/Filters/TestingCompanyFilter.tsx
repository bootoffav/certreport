import { useEffect, useReducer } from 'react';
import { useAppDispatch } from 'store/hooks';
import { changeActiveTestingCompanies } from 'store/slices/mainSlice';

type TestingCompanyState = {
  aitex: boolean;
  satra: boolean;
  bttg: boolean;
  all: boolean;
};

const getActiveCompanies = (state: TestingCompanyState) => {
  return Object.entries(state)
    .filter(([_, checked]) => checked)
    .map(([company, _]) => company);
};

const initialState = {
  aitex: false,
  satra: false,
  bttg: false,
  all: true,
};

const testingCompanyFilterReducer = (
  state: TestingCompanyState,
  {
    testingCompany,
    checked,
  }: { testingCompany: keyof TestingCompanyState & string; checked: boolean }
) =>
  testingCompany === 'all'
    ? { ...initialState, all: checked }
    : {
        ...state,
        all: false,
        [testingCompany]: checked,
      };

function TestingCompanyFilter() {
  const reduxDispatch = useAppDispatch();
  const [state, dispatch] = useReducer(
    testingCompanyFilterReducer,
    initialState
  );

  const handleChange = ({ target }: React.SyntheticEvent) => {
    const { value: testingCompany, checked }: any = target;
    dispatch({
      testingCompany,
      checked,
    });
  };

  useEffect(() => {
    reduxDispatch(changeActiveTestingCompanies(getActiveCompanies(state)));
    // eslint-disable-next-line
  }, [state]);

  return (
    <div className="d-flex align-items-start">
      <div className="btn-group btn-group-sm" data-toggle="buttons">
        {Object.keys(state).map((item) => (
          <label
            className={`btn btn-${item === 'all' ? 'info' : 'secondary'}`}
            key={item}
          >
            <input
              type="checkbox"
              value={item}
              // @ts-ignore
              checked={state[item]}
              onChange={handleChange}
            />{' '}
            {item.toUpperCase()}
          </label>
        ))}
      </div>
    </div>
  );
}

export { TestingCompanyFilter };
