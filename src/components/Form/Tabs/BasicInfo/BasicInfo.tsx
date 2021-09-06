import { Dimmer, Tab } from 'tabler-react';
import Select from 'react-select';
import { Status } from '../../../Notification/Notification';
import { BaseInput, Article, SerialNumber } from '../../FormFields';
import { PreTreatment1 } from '../../PreTreatment1';
import { selectOptions } from '../../../../defaults';
import { StageSelect } from './StageSelect';

function renderBasicInfo() {
  return (
    <Tab title="Basic Info">
      <Dimmer active={this.state.requestStatus !== Status.FillingForm} loader>
        <div className="d-flex">
          <BaseInput
            className="w-50"
            value={this.state.applicantName}
            placeholder="SHANGHAI XM GROUP LTD"
            id="applicantName"
            label="Applicant name"
            handleChange={this.handleChange}
          />
          <div className="w-25 mx-2">
            <div className="form-group">
              Testing company
              <Select
                value={this.asSelectable(this.state.testingCompany)}
                onChange={(e: any) => {
                  this.handleSelectChange(e, 'testingCompany');
                }}
                options={selectOptions.testingCompany}
              />
            </div>
          </div>
          <div className="w-50">
            <div className="form-group">
              Standards
              <Select
                isMulti
                value={this.asSelectable(this.state.standards)}
                onChange={(e: any) => {
                  this.handleSelectChange(e, 'standards');
                }}
                options={selectOptions.standards}
              />
            </div>
          </div>
        </div>
        <div className="d-flex">
          <div className="w-50">
            <div className="form-group">
              Stage
              <StageSelect
                value={this.asSelectable(this.state.stage)}
                onChange={(e: any) => {
                  this.handleSelectChange(e, 'stage');
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
                    `${this.state.resume === undefined ? 'active' : ''}`
                  }
                  onClick={() => this.setState({ resume: undefined })}
                >
                  <input type="radio" />
                  None
                </label>
                <label
                  className={
                    'btn btn-outline-danger ' +
                    `${this.state.resume === 'fail' ? 'active' : ''}`
                  }
                  onClick={() => this.setState({ resume: 'fail' })}
                >
                  <input type="radio" />
                  FAIL
                </label>
                <label
                  className={
                    'btn btn-outline-success ' +
                    `${this.state.resume === 'pass' ? 'active' : ''}`
                  }
                  onClick={() => this.setState({ resume: 'pass' })}
                >
                  <input type="radio" />
                  PASS
                </label>
                <label
                  className={
                    'btn btn-outline-warning ' +
                    `${this.state.resume === 'partly' ? 'active' : ''}`
                  }
                  onClick={() => this.setState({ resume: 'partly' })}
                >
                  <input type="radio" />
                  PASS (partly)
                </label>
                <label
                  className={
                    'btn btn-outline-dark ' +
                    `${this.state.resume === 'no sample' ? 'active' : ''}`
                  }
                  onClick={() => this.setState({ resume: 'no sample' })}
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
              value={this.asSelectable(this.state.article)}
              options={selectOptions.articles}
              handleChange={(e: any) => this.handleSelectChange([e], 'article')}
              handleSlaveChange={(product, code, brand) =>
                this.setState({ product, code, brand })
              }
            />
          </div>
          <BaseInput
            value={this.state.product}
            className="ml-2 w-25"
            id="product"
            label="Product"
            handleChange={this.handleChange}
          />
          <BaseInput
            value={this.state.code}
            className="ml-2 w-25"
            id="code"
            label="Code"
            handleChange={this.handleChange}
          />
          <BaseInput
            value={this.state.colour}
            className="ml-2 w-25"
            id="colour"
            label="Colour"
            handleChange={this.handleChange}
          />
        </div>
        <div className="d-flex">
          <div className="w-25 mr-2">
            Brand
            <Select
              value={this.asSelectable(this.state.brand)}
              onChange={(e: any) => this.handleSelectChange([e], 'brand')}
              options={selectOptions.brand}
            />
          </div>
          <BaseInput
            value={this.state.materialNeeded}
            className="w-25 mr-2"
            id="materialNeeded"
            label="Material needed"
            handleChange={this.handleChange}
          />
          <BaseInput
            value={this.state.testingTime}
            className="w-25 mr-2"
            id="testingTime"
            label="Testing Time"
            handleChange={this.handleChange}
          />
          <div className="w-25">
            <SerialNumber
              serialNumber={this.state.serialNumber}
              handleChange={this.handleChange}
            />
          </div>
        </div>
        <div className="d-flex">
          <BaseInput
            value={this.state.length}
            className="w-25 mr-2"
            id="length"
            label="Sample length (m)"
            handleChange={this.handleChange}
          />
          <BaseInput
            value={this.state.width}
            className="w-25 mr-2"
            id="width"
            label="Sample width (m)"
            handleChange={this.handleChange}
          />
          <BaseInput
            value={this.state.partNumber}
            className="w-25 mr-2"
            id="partNumber"
            label="Part number"
            handleChange={this.handleChange}
          />
          <BaseInput
            value={this.state.rollNumber}
            className="w-25"
            id="rollNumber"
            label="Roll number"
            handleChange={this.handleChange}
          />
        </div>
        <div className="d-flex">
          <div className="w-50 mr-2">
            <PreTreatment1
              pretreatment1={this.state.pretreatment1}
              result={this.state.pretreatment1Result}
              handleChange={this.handleChange}
              resultChange={this.handlePreTreatment1Change}
            />
          </div>
          <BaseInput
            value={this.state.pretreatment2}
            className="w-25 mr-2"
            id="pretreatment2"
            label="Pre-treatment 2"
            handleChange={this.handleChange}
          />
          <BaseInput
            value={this.state.pretreatment3}
            className="w-25"
            id="pretreatment3"
            label="Pre-treatment 3"
            handleChange={this.handleChange}
          />
        </div>
        <div className="d-flex">
          <BaseInput
            value={this.state.testReport}
            className="w-50 mr-2"
            id="testReport"
            required={false}
            label="Test Report"
            handleChange={this.handleChange}
          />
          <BaseInput
            value={this.state.certificate}
            className="w-50"
            id="certificate"
            required={false}
            label="Certificate"
            handleChange={this.handleChange}
          />
        </div>
        <BaseInput
          value={this.state.rem}
          className="w-100"
          id="rem"
          required={false}
          label="REM"
          handleChange={this.handleChange}
        />
      </Dimmer>
    </Tab>
  );
}

export { renderBasicInfo };
