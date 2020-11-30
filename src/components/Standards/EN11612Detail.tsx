import React from 'react';
import { Icon } from 'tabler-react';
import { DB } from '../../DBManager';
import { useState, useEffect } from 'react';

function EN11612Detail(props: any) {
  const blocks = ['A1', 'A2', 'B', 'C', 'D', 'E', 'F'];

  const onChange = ({ currentTarget: { name, dataset } }: any) => {
    DB.updateInstance(props.taskId, {
      EN11612Detail: {
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
      EN11612Detail: null,
    });
    setDetails({});
  };

  let details: any;
  let setDetails: any;
  [details, setDetails] = useState({});

  useEffect(() => {
    (async function () {
      setDetails(await DB.getStandardDetail(props.taskId, 'EN11612'));
    })();
  }, [props.taskId, setDetails]);

  return (
    <div className="d-flex justify-content-between align-item-center">
      {blocks.map((name) => {
        return (
          <div key={name} className="flex-fill d-flex flex-column">
            <p className="text-center">
              <span className="m-1">{name}</span>
            </p>
            <div className="d-flex justify-content-center">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name={name}
                  data-result="fail"
                  checked={details[name] === 'fail'}
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
                  name={name}
                  data-result="pass"
                  checked={details[name] === 'pass'}
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
                  name={name}
                  data-result="partly"
                  checked={details[name] === 'partly'}
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

export { EN11612Detail };
