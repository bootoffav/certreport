import { useReducer, useEffect } from 'react';

interface StandardFilterProps {
  update: any;
}

type StandardFilterState = {
  'EN 11611': boolean;
  'EN 11612': boolean;
  'EN 469': boolean;
  'EN 20471': boolean;
  'EN 13034': boolean;
  'EN 61482-1-2': boolean;
  All: boolean;
  [key: string]: boolean;
};

const initialState: StandardFilterState = {
  'EN 11611': false,
  'EN 11612': false,
  'EN 469': false,
  'EN 20471': false,
  'EN 13034': false,
  'EN 61482-1-2': false,
  All: true,
};

function StandardFilter({ update }: StandardFilterProps) {
  function reducer(state: StandardFilterState, { standard, checked }: any) {
    if (standard === 'All') {
      state = { ...initialState };
      state['All'] = checked;
    } else {
      state = { ...state };
      state['All'] = false;
      state[standard] = checked;
    }
    return state;
  }

  const getActiveStandards = () => {
    return Object.keys(standards).filter((st) => standards[st]);
  };

  const [standards, dispatch] = useReducer(reducer, initialState);

  // eslint-disable-next-line
  useEffect(() => update({ activeStandards: getActiveStandards() }), [
    standards,
  ]);

  return (
    <div className="d-flex align-items-center">
      <div className="btn-group" data-toggle="buttons">
        {Object.keys(standards).map((standard) => (
          <label className="btn btn-secondary" key={standard}>
            <input
              type="checkbox"
              value={standard}
              checked={standards[standard]}
              onClick={(e) => {
                dispatch({
                  standard: e.currentTarget.value,
                  checked: e.currentTarget.checked,
                });
                e.stopPropagation();
              }}
            />{' '}
            {standard}
          </label>
        ))}
      </div>
    </div>
  );
}

export { StandardFilter };
