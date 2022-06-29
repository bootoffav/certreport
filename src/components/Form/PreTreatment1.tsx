import { getTaskParamLabel } from 'Task/Task';
import { Icon } from 'tabler-react';

interface PreTreatment1Props {
  pretreatment1: string;
  result: string;
  handleChange: (e: any) => void;
  resultChange: (value: string) => void;
}

function PreTreatment1(props: PreTreatment1Props) {
  return (
    <>
      {getTaskParamLabel('pretreatment1')}
      <div className="input-group">
        <input
          type="text"
          required={true}
          className="form-control"
          id="pretreatment1"
          value={props.pretreatment1}
          onChange={props.handleChange}
        />
        <div className="input-group-append">
          <div className="input-group-text pretreatment1Result">
            <div className="form-check form-check-inline">
              <input
                type="radio"
                name="pretreatment1Result"
                id="pretreatment1Fail"
                checked={props.result === 'fail'}
                onChange={() => props.resultChange('fail')}
              />
              <label
                className="ml-2 form-check-label"
                htmlFor="pretreatment1Fail"
              >
                <Icon
                  prefix="fe"
                  width="60"
                  className="redIcon"
                  name="thumbs-down"
                />
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                name="pretreatment1Result"
                id="pretreatment1Pass"
                checked={props.result === 'pass'}
                onChange={() => props.resultChange('pass')}
              />
              <label
                className="form-check-label ml-2"
                htmlFor="pretreatment1Pass"
              >
                <Icon
                  prefix="fe"
                  width="60"
                  className="greenIcon"
                  name="thumbs-up"
                />
              </label>
            </div>
            <button
              type="button"
              className="btn btn-sm btn-link btn-reset pretreatment1-override-framework"
              onClick={() => props.resultChange('')}
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export { PreTreatment1 };
