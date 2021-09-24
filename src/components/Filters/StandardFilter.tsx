import { useReducer, useEffect } from 'react';
import { AdditionalStandardFilter } from './AdditionalStandardFilter';

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

function standardFilterReducer(
  state: StandardFilterState,
  {
    standard,
    checked,
  }: { standard: keyof StandardFilterState; checked: boolean }
) {
  switch (standard) {
    case 'All':
      state = { ...initialState };
      state['All'] = checked;
      break;
    case 'EN 469':
      state = { ...initialState };
      state['All'] = false;
      state['EN 469'] = checked;
      break;
    case 'EN 20471':
      state = { ...initialState };
      state['All'] = false;
      state['EN 20471'] = checked;
      break;
    default:
      state = { ...state };
      state['All'] = false;
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

function StandardFilter({ update }: StandardFilterProps) {
  const [standards, dispatch] = useReducer(standardFilterReducer, initialState);

  // eslint-disable-next-line
  useEffect(
    () =>
      update({
        activeStandards: getActiveCheckboxes(standards),
        additionalStandardTaskList: undefined,
      }),
    [standards]
  );

  return (
    <div className="d-flex flex-column">
      <div className="btn-group" data-toggle="buttons">
        {Object.keys(standards).map((standard) => (
          <label className="btn btn-secondary" key={standard}>
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
            {standard}
          </label>
        ))}
      </div>
      {standards['EN 469'] || standards['EN 20471'] ? (
        <AdditionalStandardFilter
          // @ts-ignore
          standard={getActiveCheckboxes(standards)[0]}
          update={update}
        />
      ) : (
        ''
      )}
    </div>
  );
}

export { StandardFilter, getActiveCheckboxes };
export type { StandardFilterState };
