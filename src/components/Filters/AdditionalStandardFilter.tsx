import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { changeAdditionalStandardFilterList } from '../../store/slices/mainSlice';
import Loader from 'react-loader-spinner';
import DB from '../../backend/DBManager';
import { standardParamMap } from '../../defaults';
import { shallowEqual } from 'react-redux';

function AdditionalStandardFilter() {
  const dispatch = useAppDispatch();
  const standard = useAppSelector(
    ({ main }) => main.activeStandards as unknown as 'EN 469' | 'EN 20471',
    shallowEqual
  );
  const [loading, setLoading] = useState(false);
  const [paramList, setParamList] = useState<
    | typeof standardParamMap['EN 469'][number][]
    | typeof standardParamMap['EN 20471'][number][]
  >([]);

  useEffect(() => setParamList([]), [standard]);

  const onChange = ({ target }: React.SyntheticEvent) => {
    const { value, checked } = target as unknown as {
      value: typeof paramList[number];
      checked: boolean;
    };
    // @ts-ignore // TO-DO
    setParamList((state) =>
      checked
        ? [...state, value]
        : [...state].filter((param) => param !== value)
    );
  };

  const standardParams = standardParamMap[standard].map((param) => (
    <label className="btn btn-secondary" key={param}>
      <input
        type="checkbox"
        value={param}
        // @ts-ignore
        checked={paramList.includes(param)}
        onChange={onChange}
      />{' '}
      {param}
    </label>
  ));

  return (
    <div className="d-flex justify-content-center align-items-baseline">
      <div className="btn-group" data-toggle="buttons">
        {standardParams}
      </div>
      <button
        className="btn btn-success ml-1"
        type="submit"
        disabled={loading}
        onClick={async (e) => {
          setLoading(true);
          const taskList = await fetchTaskIdsFromDB(
            paramList,
            standard[0] as keyof typeof standardParamMap
          );
          dispatch(changeAdditionalStandardFilterList(taskList));
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

function buildIndex(param: string, standard: keyof typeof standardParamMap) {
  return (
    `aitex_${standard.replace(/\s/g, '')}Detail` +
    `${param.replace(/\s|\./g, '')}`
  );
}

const fetchTaskIdsFromDB = async (
  activeCheckboxes: string[],
  standard: keyof typeof standardParamMap
): Promise<string[]> => {
  const indexes = activeCheckboxes.map((param) => buildIndex(param, standard));

  const taskList: string[] = await indexes.reduce(
    async (list: any, index) => [
      ...(await list),
      // fix asap
      // ...(await DB.queryIndex(index)),
    ],
    Promise.resolve([])
  );

  return [...new Set(taskList)]; // remove duplicates
};

export default AdditionalStandardFilter;
