import { useReducer, useState } from 'react';

interface StandardFilterProps {
  update: any;
}

interface StandardFilterState {
  'EN 11611': boolean;
  'EN 11612': boolean;
  'EN 469': boolean;
  'EN 20471': boolean;
  'EN 13034': boolean;
  'EN 61482-1-2': boolean;
}

const initialState: StandardFilterState = {
  'EN 11611': true,
  'EN 11612': true,
  'EN 469': true,
  'EN 20471': true,
  'EN 13034': true,
  'EN 61482-1-2': true,
};

function StandardFilter({ update }: StandardFilterProps) {
  function reducer(state: StandardFilterState, { standard, checked }: any) {
    // @ts-expect-error
    state[standard] = checked;
    return state;
  }

  const getActiveStandards = () =>
    // @ts-expect-error
    Object.keys(standards).filter((st) => standards[st]);

  const [standards, dispatch] = useReducer(reducer, initialState);
  const [hidden, setHidden] = useState(true);

  return hidden ? (
    <div className="pb-1">
      {' '}
      <button
        type="button"
        className="btn btn-light btn-block"
        onClick={() => setHidden(false)}
      >
        Filter by Standards
      </button>
    </div>
  ) : (
    <div className="d-flex align-items-center">
      <div className="btn-group" data-toggle="buttons">
        {Object.keys(standards).map((standard) => (
          <label className="btn btn-secondary btn-sm" key={standard}>
            <input
              type="checkbox"
              value={standard}
              // @ts-expect-error
              defaultChecked={standards[standard]}
              onClick={(e) => {
                e.stopPropagation();
                dispatch({
                  standard: e.currentTarget.value,
                  checked: e.currentTarget.checked,
                });
                update({ activeStandards: getActiveStandards() });
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
