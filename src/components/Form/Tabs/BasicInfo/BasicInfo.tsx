import { useState, useEffect } from 'react';
import { Dimmer } from 'tabler-react';
import Select from 'react-select';
import { Status } from 'components/Notification/Notification';
import { BaseInput, Article, SerialNumber } from 'components/Form/FormFields';
import { PreTreatment1 } from 'components/Form/PreTreatment1';
import { selectOptions } from 'defaults';
import { StageSelect } from './StageSelect';
import StandardSelector from './StandardSelector/StandardSelector';
import DB from 'backend/DBManager';

function BasicInfo({ taskId, setState, ...props }: any) {
  const [factory, setFactory] = useState('');
  const [rem, setRem] = useState('');

  useEffect(() => {
    (async function () {
      DB.get(taskId, ['data', 'factory'], 'certification')
        .then((factory) => {
          setState({ factory }, () => setFactory(factory));
        })
        .catch(() => setFactory(props.factory));
      DB.getFabricAppFormState(taskId).then(({ rem }) => {
        rem && setRem(rem);
      });
    })();
  }, [taskId, setRem, setFactory, props.factory]); // eslint-disable-line

  return (
    <Dimmer active={props.requestStatus !== Status.FillingForm} loader>
      <div className="d-flex">
        <BaseInput
          className="w-50"
          value={props.applicantName}
          placeholder="SHANGHAI XM GROUP LTD"
          id="applicantName"
          label="Applicant name"
          handleChange={props.handleChange}
        />
        <div className="w-25 mx-2">
          <div className="form-group">
            Testing company
            <Select
              value={props.asSelectable(props.testingCompany)}
              onChange={(e: any) => {
                props.handleSelectChange(e, 'testingCompany');
              }}
              options={selectOptions.testingCompany}
            />
          </div>
        </div>
        <div className="w-50">
          <div className="form-group">
            Standards
            <StandardSelector
              taskId={taskId}
              asSelectable={props.asSelectable}
              chosenStandards={props.standards}
              handleSelectChange={props.handleSelectChange}
            />
          </div>
        </div>
      </div>
      <div className="d-flex">
        <div className="w-50">
          <div className="form-group">
            Stage
            <StageSelect
              value={props.asSelectable(props.stage)}
              onChange={(e: any) => {
                props.handleSelectChange(e, 'stage');
              }}
              options={selectOptions.stages}
            />
          </div>
        </div>
        <div className="ml-2">
          Results:
          <div className="form-group">
            <div className="btn-group btn-group-toggle" data-toggle="buttons">
              <label
                className={
                  'btn btn-outline-secondary ' +
                  `${props.resume === undefined ? 'active' : ''}`
                }
                onClick={() => setState({ resume: undefined })}
              >
                <input type="radio" />
                None
              </label>
              <label
                className={
                  'btn btn-outline-danger ' +
                  `${props.resume === 'fail' ? 'active' : ''}`
                }
                onClick={() => setState({ resume: 'fail' })}
              >
                <input type="radio" />
                FAIL
              </label>
              <label
                className={
                  'btn btn-outline-success ' +
                  `${props.resume === 'pass' ? 'active' : ''}`
                }
                onClick={() => setState({ resume: 'pass' })}
              >
                <input type="radio" />
                PASS
              </label>
              <label
                className={
                  'btn btn-outline-warning ' +
                  `${props.resume === 'partly' ? 'active' : ''}`
                }
                onClick={() => setState({ resume: 'partly' })}
              >
                <input type="radio" />
                PASS (partly)
              </label>
              <label
                className={
                  'btn btn-outline-dark ' +
                  `${props.resume === 'no sample' ? 'active' : ''}`
                }
                onClick={() => setState({ resume: 'no sample' })}
              >
                <input type="radio" />
                NO Sample
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex">
        <div className="w-25">
          <Article
            value={props.asSelectable(props.article)}
            options={selectOptions.articles}
            handleChange={(e: any) => props.handleSelectChange([e], 'article')}
            handleSlaveChange={(product, code, brand, colour) =>
              setState({ product, code, brand, colour })
            }
          />
        </div>
        <BaseInput
          value={props.product}
          className="ml-2 w-25"
          id="product"
          label="Product"
          handleChange={props.handleChange}
        />
        <BaseInput
          value={props.code}
          className="ml-2 w-25"
          id="code"
          label="Code"
          handleChange={props.handleChange}
        />
        <BaseInput
          value={props.colour}
          className="ml-2 w-25"
          id="colour"
          label="Colour"
          handleChange={props.handleChange}
        />
      </div>
      <div className="d-flex">
        <div className="w-25 mr-2">
          Brand
          <Select
            value={props.asSelectable(props.brand)}
            onChange={(e: any) => props.handleSelectChange([e], 'brand')}
            options={selectOptions.brand}
          />
        </div>
        <BaseInput
          value={props.materialNeeded}
          className="w-25 mr-2"
          id="materialNeeded"
          label="Material needed"
          handleChange={props.handleChange}
        />
        <BaseInput
          value={props.testingTime}
          className="w-25 mr-2"
          id="testingTime"
          label="Testing Time"
          handleChange={props.handleChange}
        />
        <div className="w-25">
          <SerialNumber
            serialNumber={props.serialNumber}
            handleChange={props.handleChange}
          />
        </div>
      </div>
      <div className="d-flex">
        <BaseInput
          value={props.length}
          className="w-25 mr-2"
          id="length"
          label="Sample length (m)"
          handleChange={props.handleChange}
        />
        <BaseInput
          value={props.width}
          className="w-25 mr-2"
          id="width"
          label="Sample width (m)"
          handleChange={props.handleChange}
        />
        <BaseInput
          value={props.partNumber}
          className="w-25 mr-2"
          id="partNumber"
          label="Part number"
          handleChange={props.handleChange}
        />
        <BaseInput
          value={props.rollNumber}
          className="w-25"
          id="rollNumber"
          label="Roll number"
          handleChange={props.handleChange}
        />
      </div>
      <div className="d-flex">
        <div className="w-50 mr-2">
          <PreTreatment1
            pretreatment1={props.pretreatment1}
            result={props.pretreatment1Result}
            handleChange={props.handleChange}
            resultChange={props.handlePreTreatment1Change}
          />
        </div>
        <div className="w-25 mr-2">
          Pre-treatment 2
          <div className="input-group">
            <div className="input-group-text w-25">
              <input
                className="form-check-input ml-4"
                type="checkbox"
                checked={props.pretreatment2Active || false}
                onChange={({ target }) => {
                  setState({
                    pretreatment2Active: target.checked,
                  });
                }}
              />
            </div>
            <input
              type="text"
              id="pretreatment2"
              className="form-control"
              value={props.pretreatment2}
              onChange={props.handleChange}
              disabled={!props.pretreatment2Active}
            />
          </div>
        </div>
        <BaseInput
          value={factory}
          className="w-25"
          id="factory"
          label="Factory"
          required={false}
          handleChange={({ target }) =>
            setFactory((target as HTMLInputElement).value)
          }
          onBlur={() => {
            setState({ factory }, () =>
              DB.updateInstance(taskId, { factory }, 'certification')
            );
          }}
        />
      </div>
      <div className="d-flex">
        <BaseInput
          value={props.testReport}
          className="w-50 mr-2"
          id="testReport"
          required={false}
          label="Test Report"
          handleChange={props.handleChange}
        />
        <BaseInput
          value={props.certificate}
          className="w-50"
          id="certificate"
          required={false}
          label="Certificate"
          handleChange={props.handleChange}
        />
      </div>
      <BaseInput
        value={rem}
        className="w-100"
        id="rem"
        required={false}
        label="REM"
        handleChange={({ target }) =>
          setRem((target as HTMLInputElement).value)
        }
        onBlur={() => {
          setState({ rem }, () => DB.updateInstance(taskId, { rem }, 'aitex'));
        }}
      />
    </Dimmer>
  );
}

export default BasicInfo;
