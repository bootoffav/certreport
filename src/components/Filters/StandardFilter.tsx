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

  const getActiveStandards = () => {
    return Object.keys(standards).filter((st) => standards[st]);
  };

  const [standards, dispatch] = useReducer(reducer, initialState);

  // eslint-disable-next-line
  useEffect(() => update({ activeStandards: getActiveStandards() }), [
    standards,
  ]);

  return (
    <div className="d-flex flex-column">
      <div className="btn-group" data-toggle="buttons">
        {Object.keys(standards).map((standard) => (
          <label className="btn btn-secondary" key={standard}>
            <input
              type="checkbox"
              value={standard}
              checked={standards[standard]}
              onChange={(e) => {
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
      {standards['EN 469'] || standards['EN 20471'] ? (
        <AdditionalStandardFilter standards={standards} />
      ) : (
        ''
      )}
    </div>
  );
}

function AdditionalStandardFilter({
  standards,
}: {
  standards: StandardFilterState;
}) {
  const blocks = {
    EN469: [
      '6.2.1.1 Flame-New',
      '6.2.2 Flame-Wash',
      '6.2.1.6 Heat-New',
      '6.2.6.4 Ra',
    ],
    EN20471: [
      '5.1.2 Color-New',
      '5.2 Color-Xenon',
      '6.1 Ra-New',
      '6.2 Ra-Wash',
    ],
  };

  const activeStandard = standards['EN 469'] ? 'EN469' : 'EN20471';
  return (
    <>
      <div className="d-flex justify-content-center align-items-start">
        <div className="btn-group" data-toggle="buttons">
          {blocks[activeStandard].map((standard) => (
            <label className="btn btn-secondary" key={standard}>
              <input
                type="checkbox"
                value={standard}
                // checked={standards[standard]}
                onChange={(e) => {
                  // dispatch({
                  //   standard: e.currentTarget.value,
                  //   checked: e.currentTarget.checked,
                  // });
                  e.stopPropagation();
                }}
              />{' '}
              {standard}
            </label>
          ))}
        </div>
        <button
          className="btn btn-success ml-1"
          data-bs-toggle="modal"
          data-bs-target="#notAvailableModal"
          type="submit"
        >
          Apply
        </button>
      </div>
      <div
        className="modal fade"
        id="notAvailableModal"
        tabIndex={-1}
        aria-labelledby="notAvailableModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="notAvailableModalLabel">
                not yet available
              </h5>
            </div>
            <div className="modal-body">
              Функция поиска по этим параметрам затрагивает обращение к БД и
              будет скоро реализовано.
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export { StandardFilter };
