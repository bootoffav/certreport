import { useEffect } from 'react';
import { useState } from 'react';

type TestingCompanyState = {
  aitex: boolean;
  satra: boolean;
  bttg: boolean;
};

const getActiveCompanies = (state: TestingCompanyState) => {
  return Object.entries(state)
    .filter(([_, checked]) => checked)
    .map(([company, _]) => company);
};

function TestingCompanyFilter({ update }: any) {
  const [state, setState] = useState<TestingCompanyState>({
    aitex: true,
    satra: true,
    bttg: true,
  });

  const handleChange = ({ target }: React.SyntheticEvent) => {
    setState(() => ({
      ...state,
      // @ts-ignore
      [target.value]: target.checked,
    }));
  };

  useEffect(() => {
    update({ activeTestingCompanies: getActiveCompanies(state) });
    // eslint-disable-next-line
  }, [state]);

  return (
    <div className="d-flex align-items-start">
      <div className="btn-group" data-toggle="buttons">
        {Object.keys(state).map((item) => (
          <label className="btn btn-secondary" key={item}>
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
