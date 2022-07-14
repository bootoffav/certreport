import { useReducer, useEffect } from 'react';
import { useAppDispatch } from 'store/hooks';
import { changeActiveStandards } from 'store/slices/mainSlice';
import { AdditionalStandardFilter } from './AdditionalStandardFilter';

type StandardFilterState = {
  'EN 11611': boolean;
  'EN 11612': boolean;
  'EN 469': boolean;
  'EN 20471': boolean;
  'EN 13034': boolean;
  'EN 61482-1-2': boolean;
  all: boolean;
};

const initialState: StandardFilterState = {
  'EN 11611': false,
  'EN 11612': false,
  'EN 469': false,
  'EN 20471': false,
  'EN 13034': false,
  'EN 61482-1-2': false,
  all: true,
};

function standardFilterReducer(
  state: StandardFilterState,
  {
    standard,
    checked,
  }: { standard: keyof StandardFilterState; checked: boolean }
) {
  switch (standard) {
    case 'all':
      state = { ...initialState };
      state['all'] = checked;
      break;
    case 'EN 469':
      state = { ...initialState };
      state['all'] = false;
      state['EN 469'] = checked;
      break;
    case 'EN 20471':
      state = { ...initialState };
      state['all'] = false;
      state['EN 20471'] = checked;
      break;
    default:
      state = { ...state };
      state['all'] = false;
      state['EN 469'] = false;
      state['EN 20471'] = false;
      state[standard] = checked;
  }
  return state;
}

const getActiveCheckboxes = (checkboxPair: any) => {
  return Object.entries(checkboxPair)
    .filter(([_, active]) => active)
    .map(([value, _]) => value);
};

function StandardFilter() {
  const reduxDispatch = useAppDispatch();
  const [standards, dispatch] = useReducer(standardFilterReducer, initialState);

  useEffect(() => {
    reduxDispatch(changeActiveStandards(getActiveCheckboxes(standards)));
  }, [standards, reduxDispatch]);

  return (
    <div className="d-flex flex-column">
      <div className="btn-group btn-group-sm" data-toggle="buttons">
        {Object.keys(standards).map((standard) => (
          <label
            className={`btn btn-${standard === 'All' ? 'info' : 'secondary'}`}
            key={standard}
          >
            <input
              type="checkbox"
              value={standard}
              // @ts-expect-error
              checked={standards[standard]}
              onChange={(e) => {
                dispatch({
                  // @ts-ignore
                  standard: e.currentTarget.value,
                  checked: e.currentTarget.checked,
                });
                e.stopPropagation();
              }}
            />{' '}
            {standard.toUpperCase()}
          </label>
        ))}
      </div>
      {standards['EN 469'] || standards['EN 20471'] ? (
        <AdditionalStandardFilter
          // @ts-ignore
          standard={getActiveCheckboxes(standards)[0]}
        />
      ) : (
        ''
      )}
    </div>
  );
}

export { StandardFilter, getActiveCheckboxes };
export type { StandardFilterState };
