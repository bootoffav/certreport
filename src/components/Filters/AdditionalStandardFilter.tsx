import { useReducer, useState, useEffect } from 'react';
import { DB } from '../../backend/DBManager';
import { standardParamMap } from '../../defaults';
import type { StandardFilterState } from './StandardFilter';
import { getActiveCheckboxes } from './StandardFilter';

type AdditionalStandardFilterProps = {
  standard: keyof StandardFilterState & ('EN 469' | 'EN 20471');
  update: any;
};

function AdditionalStandardFilter({
  standard,
  update,
}: AdditionalStandardFilterProps) {
  function additionalStandardReducer(state: any, { param, checked }: any) {
    state[param] = checked;
    return { ...state };
  }

  let initialState: any = {};

  standardParamMap[standard].forEach((prop) => {
    initialState[prop] = false;
  });

  const [state, dispatch] = useReducer(additionalStandardReducer, initialState);
  const [tasksList, setTasksList] = useState<string[]>();

  useEffect(() => {
    update({ additionalStandardTaskList: tasksList });
    // eslint-disable-next-line
  }, [tasksList]);

  return (
    <>
      <div className="d-flex justify-content-center align-items-start">
        <div className="btn-group" data-toggle="buttons">
          {Object.keys(state).map((param) => {
            return (
              <label className="btn btn-secondary" key={param}>
                <input
                  type="checkbox"
                  value={param}
                  // @ts-ignore
                  checked={state[param]}
                  onChange={(e) => {
                    dispatch({
                      param: e.currentTarget.value,
                      checked: e.currentTarget.checked,
                    });
                    e.stopPropagation();
                  }}
                />{' '}
                {param}
              </label>
            );
          })}
        </div>
        <button
          className="btn btn-success ml-1"
          // data-bs-toggle="modal"
          data-bs-target="#notAvailableModal"
          type="submit"
          onClick={() => {
            fetchTaskIdsFromDB(state, standard).then((list) =>
              setTasksList(list)
            );
          }}
        >
          Apply
        </button>
      </div>
      <Modal />
    </>
  );
}

function buildIndex(prop: string, standard: string) {
  return (
    `aitex_${standard.replace(/\s/g, '')}Detail` +
    `${prop.replace(/\s|\./g, '')}`
  );
}

const fetchTaskIdsFromDB = async (
  params: any,
  standard: string
): Promise<string[]> => {
  const list: string[] = [];

  // build indexes
  const indexes: string[] = [];
  for (const prop in params) {
    if (params[prop]) {
      indexes.push(buildIndex(prop, standard));
    }
  }

  // query per index
  for (const index of indexes) {
    const listPerIndex = await DB.queryIndex(index).then((result: unknown) => {
      if (result && typeof result === 'object') {
        // @ts-ignore
        return result.data.map(({ ref }: any) => ref.id);
      }
    });
    list.push(...listPerIndex);
  }

  return [...new Set(list)]; // remove duplicates
};

const Modal = () => (
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
          Функция поиска по этим параметрам затрагивает обращение к БД и будет
          скоро реализовано.
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
);

export { AdditionalStandardFilter };
