import { Icon } from 'tabler-react';
import { DB } from '../../../../backend/DBManager';
import { useState, useEffect } from 'react';
import { ResultField } from './ResultField';

export type StandardDetailProps = {
  name: 'EN 11612' | 'EN 469' | 'EN 20471';
  taskId: string;
};

function StandardDetail(props: StandardDetailProps) {
  const blocks = {
    EN11612: ['A1', 'A2', 'B', 'C', 'D', 'E', 'F'],
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
  const standardName = props.name.split(' ').join('') as
    | 'EN11612'
    | 'EN469'
    | 'EN20471';

  const onChange = ({ currentTarget: { name, dataset } }: any) => {
    DB.updateInstance(props.taskId, {
      [`${standardName}Detail`]: {
        [name]: dataset.result,
      },
    }).catch(console.log);
    setDetails((state: any) => ({
      ...state,
      [name]: dataset.result,
    }));
  };

  const reset = () => {
    DB.updateInstance(props.taskId, {
      [`${standardName}Detail`]: null,
    });
    setDetails({});
  };

  let details: any;
  let setDetails: any;
  [details, setDetails] = useState({});

  useEffect(() => {
    (async function () {
      setDetails(await DB.get(props.taskId, `${standardName}Detail`, 'aitex'));
    })();
  }, [props.taskId, setDetails, standardName]);

  return (
    <div className="d-flex justify-content-between align-item-center">
      {blocks[standardName].map((paramName) => {
        return (
          <div key={paramName} className="flex-fill d-flex flex-column">
            <p className="text-center">
              <span className="m-1">{paramName}</span>
            </p>
            <div className="d-flex justify-content-center">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={paramName}
                  data-result="fail"
                  checked={details[paramName] === 'fail'}
                  onChange={onChange}
                />
                <label className="form-check-label">
                  <Icon
                    prefix="fe"
                    width="60"
                    className="redIcon"
                    name="thumbs-down"
                  />
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={paramName}
                  data-result="pass"
                  checked={details[paramName] === 'pass'}
                  onChange={onChange}
                />
                <label className="form-check-label">
                  <Icon
                    prefix="fe"
                    width="60"
                    className="greenIcon"
                    name="thumbs-up"
                  />
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={paramName}
                  data-result="partly"
                  checked={details[paramName] === 'partly'}
                  onChange={onChange}
                />
                <label className="form-check-label">
                  <Icon
                    prefix="fe"
                    width="60"
                    className="yellowIcon"
                    name="alert-circle"
                  />
                </label>
              </div>
            </div>
            {(props.name === 'EN 469' || props.name === 'EN 20471') && (
              <ResultField
                standardName={props.name}
                param={paramName}
                taskId={props.taskId}
              />
            )}
          </div>
        );
      })}
      <button
        type="button"
        className="btn btn-sm btn-link btn-reset"
        onClick={reset}
      >
        Reset
      </button>
    </div>
  );
}

export { StandardDetail };
