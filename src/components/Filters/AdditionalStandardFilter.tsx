import { useState, useEffect } from 'react';
import Loader from 'react-loader-spinner';

import { DB } from '../../backend/DBManager';
import { standardParamMap } from '../../defaults';
import { getActiveCheckboxes } from './StandardFilter';
import type { StandardFilterState } from './StandardFilter';

type AdditionalStandardFilterProps = {
  standard: keyof StandardFilterState & ('EN 469' | 'EN 20471');
  update: any;
};

function AdditionalStandardFilter({
  standard,
  update,
}: AdditionalStandardFilterProps) {
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setState(
      standardParamMap[standard].reduce(
        (o, key) => ({ ...o, [key]: false }),
        {}
      )
    );
    return () => update({ additionalStandardFilterTaskList: undefined });
    // eslint-disable-next-line
  }, [standard]);

  const jsx = Object.keys(state).map((param) => (
    <label className="btn btn-secondary" key={param}>
      <input
        type="checkbox"
        value={param}
        // @ts-ignore
        checked={state[param]}
        onChange={({ target }) => {
          setState((state) => ({
            ...state,
            [target.value]: target.checked,
          }));
        }}
      />{' '}
      {param}
    </label>
  ));

  return (
    <div className="d-flex justify-content-center align-items-baseline">
      <div className="btn-group" data-toggle="buttons">
        {jsx}
      </div>
      <button
        className="btn btn-success ml-1"
        type="submit"
        disabled={loading}
        onClick={async (e) => {
          setLoading(true);
          e.preventDefault();
          const taskList = await fetchTaskIdsFromDB(
            getActiveCheckboxes(state),
            standard
          );
          update({ additionalStandardFilterTaskList: taskList });
          setLoading(false);
        }}
      >
        {loading ? (
          <Loader type="Oval" color="#000000" height={16} width={16} />
        ) : (
          'Apply'
        )}
      </button>
    </div>
  );
}

function buildIndex(param: string, standard: string) {
  return (
    `aitex_${standard.replace(/\s/g, '')}Detail` +
    `${param.replace(/\s|\./g, '')}`
  );
}

const fetchTaskIdsFromDB = async (
  activeCheckboxes: string[],
  standard: string
): Promise<string[]> => {
  const indexes = activeCheckboxes.map((param) => buildIndex(param, standard));

  const taskList: string[] = await indexes.reduce(
    async (list: any, index) => [
      ...(await list),
      ...(await DB.queryIndex(index)),
    ],
    Promise.resolve([])
  );

  return [...new Set(taskList)]; // remove duplicates
};

export { AdditionalStandardFilter };
