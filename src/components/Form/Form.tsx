import React, { DOMElement } from 'react';
import { PickDate, BaseInput, Article, Price, Paid, Pi } from "./FormFields";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import Select from 'react-select';
import B24 from '../../B24';
import Notification, { Status } from '../Notification/Notification';
import SerialNumber from '../SerialNumber/SerialNumber';
import m from 'moment';
import { select_options, emptyState } from '../../defaults';
import { IState } from '../../defaults';
import Export from '../Export/Export';
import { dateConverter } from '../../helpers';
import Standards from '../Standards/Standards';

interface IFormState extends IState {
  requestStatus: Status;
}

interface IFormProps {
  match: {
    path: string;
    url: string;
    params: {
      id: string;
    };
  };
  location: {
    state: IFormState;
  };
}

export default class Form extends React.Component<IFormProps> {
  task_id: string | undefined;
  state: IFormState;

  constructor(props: IFormProps) {
    super(props);
    this.task_id = props.match.params.id;
    this.state = props.location.state || emptyState;
    this.state.requestStatus = Status.FillingForm;
  }

  componentDidMount() {
    if (this.props.match.path === '/edit/:id' && (this.props.location.state === undefined)) {
      B24.get_task(this.task_id).then(r => this.setState({ ...r.state }));
    }
    if (!this.state.link) {
      this.setState({ link: `[URL=https://certreport.xmtextiles.com/edit/${this.task_id}/]this task[/URL]` });
    }
  }

  handleDateChange = (date: Date | null, prop: string): void =>
    this.setState({ [prop]: date === null ? '' : m(date).format('DDMMMYYYY') });


  handleCheckboxChange = ({ currentTarget }: React.SyntheticEvent) : void =>
    this.setState({ [currentTarget.id]: (currentTarget as HTMLInputElement).checked });

  handleSelectChange = (selected: {
    label: string;
    value: string
  }[], id: string) => {
    selected = Array.isArray(selected) ? selected : [selected];
    this.setState({
      [id]: selected.reduce(
        (endValue, currentValue, index) => index === selected.length - 1
          ? `${endValue}${currentValue.label}`
          : `${endValue}${currentValue.label}, `, '')
    });
  }

  handleChange = (e: any) => this.setState({ [e.target.id]: e.target.value });

  handleCert (e : any) {
    e.preventDefault();
    if (window.confirm('Are you sure?')) {
      this.setState({ requestStatus: Status.Loading });
      this.task_id
      ? B24.updateTask(this.state, this.task_id)
        .then(
          () => this.afterSuccessfulSubmit(),
          () => this.afterUnsuccessfulSubmit()
        )
      : B24.createTask(this.state)
        .then(
          () => this.afterSuccessfulSubmit(),
          () => this.afterUnsuccessfulSubmit()
        )
    }
  }

  asSelectable = (value : string) => {
    if (value !== '') {
      const splitted : string[] = value.split(', ');
      return splitted.length === 1
      ? [{ label: value, value }]
      : splitted.map(label => ({label, value: label }));
    }
  }

  afterSuccessfulSubmit() {
    this.setState({ requestStatus: Status.Success });
    sessionStorage.removeItem('tasks');
    setTimeout(() => window.location.replace("/"), 2000);
  }

  afterUnsuccessfulSubmit() {
    this.setState({ requestStatus: Status.Failure });
    setTimeout(() => this.setState({
      requestStatus: Status.FillingForm
    }), 3000);
  }

  renderBasicInfo() {
    return <>
    <div className="d-flex">
      <BaseInput value={this.state.applicantName} placeholder='SHANGHAI XM GROUP LTD' id='applicantName' label='Applicant name' handleChange={this.handleChange} />
      <div className="flex-fill ml-2">
        <div className="form-group">
          Testing company
          <Select
            value={this.asSelectable(this.state.testingCompany)}
            onChange={e => {
              this.handleSelectChange(e, 'testingCompany')}
            }
            options={select_options.testingCompany}
          />
        </div>
      </div>
      <div className="ml-2">
        <div className="form-group">
          Standards
          <Select isMulti
            value={this.asSelectable(this.state.standards)}
            onChange={e => {
              this.handleSelectChange(e, 'standards')}
            }
            options={select_options.standards}
          />
        </div>
      </div>
      <div className="flex-fill mx-2">
        <div className="form-group">
          Stage
          <Select
            value={this.asSelectable(this.state.stage)}
            onChange={e => {
              this.handleSelectChange(e, 'stage')}
            }
            options={select_options.stages}
          />
        </div>
      </div>
      <div>
        Results:
        <div className="form-group">
          <div className="btn-group btn-group-toggle" data-toggle="buttons">
            <label
              className={
                'btn btn-outline-light ' +
                `${this.state.resume === undefined ? 'active' : ''}`
              }
              onClick={() => this.setState({ resume: undefined })}
            ><input type="radio" />None</label>
            <label
              className={
                'btn btn-outline-danger ' +
                `${this.state.resume === 'fail' ? 'active' : ''}`
              }
              onClick={() => this.setState({ resume: 'fail' })}
              ><input type="radio" />FAIL</label>
            <label
              className={
                'btn btn-outline-success ' +
                `${this.state.resume === 'pass' ? 'active' : ''}`
              }
              onClick={() => this.setState({ resume: 'pass' })}
              ><input type="radio" />PASS</label>
          </div>
        </div>
      </div>
    </div>
    <div className="d-flex">
      <div className="flex-fill">
        <Article
        value={this.asSelectable(this.state.article)}
        options={select_options.articles}
        handleChange={(e: any) => this.handleSelectChange([e], 'article')}
        handleSlaveChange={ ({product, code, brand}) => this.setState({ product, code, brand }) }
        />
      </div>
      <BaseInput value={this.state.product} className="ml-2 flex-grow-1" id='product' label='Product' handleChange={this.handleChange} />
      <BaseInput value={this.state.code} className="ml-2" id='code' label='Code' handleChange={this.handleChange} />
      <BaseInput value={this.state.colour} className="ml-2" id='colour' label='Colour' handleChange={this.handleChange} />
    </div>

    <div className="d-flex">
      <div className="flex-grow-1">
        Brand
        <Select value={this.asSelectable(this.state.brand)} onChange={e => this.handleSelectChange([e], 'brand')}
          options={select_options.brand}
        />
      </div>
      <BaseInput value={this.state.materialNeeded} className="flex-grow-1 mx-2" id='materialNeeded' label='Material needed' handleChange={this.handleChange} />
      <BaseInput value={this.state.testingTime} className="flex-grow-1" id='testingTime' label='Testing Time' handleChange={this.handleChange} />
    </div>
    <div className="d-flex">
      <BaseInput value={this.state.length} className="flex-grow-1" id='length' label='Sample length (m)' handleChange={this.handleChange} />
      <BaseInput value={this.state.width} className="flex-grow-1 ml-2" id='width' label='Sample width (m)' handleChange={this.handleChange} />
    </div>
    <div className="d-flex">
      <BaseInput value={this.state.partNumber} className="flex-grow-1" id='partNumber' label='Part number' handleChange={this.handleChange} />
      <BaseInput value={this.state.rollNumber} className="flex-grow-1 ml-2" id='rollNumber' label='Roll number' handleChange={this.handleChange} />
    </div>
    <div className="d-flex">
      <div className="flex-grow-1">
      Pre-treatment 1
        <div className="input-group">
          <input type='text' required={true} className="form-control"
            id='pretreatment1' value={this.state.pretreatment1} onChange={this.handleChange}/>
          <div className="input-group-append">
            <div className="input-group-text">
              <div className="form-check form-check-inline">
                <input type="radio" name="pretreatment1Result" id="pretreatment1Fail"
                  checked={this.state.pretreatment1Result === 'fail'}
                  onChange={() => this.setState({
                    pretreatment1Result: 'fail'
                  })
                  }
                />
                <label className="ml-2 form-check-label" htmlFor="pretreatment1Fail">
                  <span className="oi oi-circle-x"></span>
                </label>
              </div>
            <div className="form-check form-check-inline">
              <input type="radio" name="pretreatment1Result" id="pretreatment1Pass"
                checked={this.state.pretreatment1Result === 'pass'}
                onChange={() => this.setState({
                  pretreatment1Result: 'pass'
                })
                }
              />
              <label className="form-check-label ml-2" htmlFor="pretreatment1Pass"><span className="oi oi-thumb-up"></span></label>
            </div>
          </div>
        </div>
        </div>
      </div>
      <BaseInput value={this.state.pretreatment2} className="flex-grow-1 mx-2" id='pretreatment2' label='Pre-treatment 2' handleChange={this.handleChange} />
      <BaseInput value={this.state.pretreatment3} className="flex-grow-1" id='pretreatment3' label='Pre-treatment 3' handleChange={this.handleChange} />
    </div>
    <div className="d-flex">
      <div className="flex-grow-1 from-group">
        <SerialNumber
          serialNumber={this.state.serialNumber}
          handleChange={this.handleChange}
          handleInit={(v : any) => this.setState({serialNumber: v})} url={this.props.match.url}/>
      </div>
      <BaseInput value={this.state.testReport} className="flex-grow-1 mx-2" id='testReport' required={false} label='Test Report' handleChange={this.handleChange} />
      <BaseInput value={this.state.certificate} className="flex-grow-1" id='certificate' required={false} label='Certificate' handleChange={this.handleChange} />
    </div>
    </>;
  }

  renderDates() {
    return <>
      <div className="d-flex justify-content-center mb-4">
          <PickDate date={this.state.readyOn} label='Sample to be prepared:'
            handleChange={(date: Date) => this.handleDateChange(date, 'readyOn')}/>
          <PickDate date={this.state.sentOn} label='Sample has sent:'
              handleChange={(date: Date) => this.handleDateChange(date, 'sentOn')} />
          <PickDate date={this.state.receivedOn} label='Sample has received by lab:'
            handleChange={(date: Date) => this.handleDateChange(date, 'receivedOn')}/>
          <PickDate date={this.state.startedOn} label='Test is started:'
              handleChange={(date: Date) => this.handleDateChange(date, 'startedOn')} />
      </div>

      <div className="d-flex justify-content-around">
        <span className="pl-1">
          Tests to be finished / really finished on:
        </span> 
        <span>
          Certificate to be received / really received on:
        </span>
      </div>

      <div className="d-flex justify-content-center">
        <div className="form-group mx-2">
          <DatePicker className="form-control"
            placeholderText="plan"
            dateFormat="dd.MM.yyyy"
            selected={this.state.testFinishedOnPlanDate ? new Date(dateConverter(this.state.testFinishedOnPlanDate)) : undefined}
            onChange={(date : Date) => this.handleDateChange(date, 'testFinishedOnPlanDate')}
          />
        </div>
        <div className="form-group mx-2">
          <DatePicker className="form-control"
            placeholderText="fact"
            dateFormat="dd.MM.yyyy"
            selected={this.state.testFinishedOnRealDate ? new Date(dateConverter(this.state.testFinishedOnRealDate)) : undefined}
            onChange={(date: Date) => this.handleDateChange(date, 'testFinishedOnRealDate')}
          />
        </div>
      
        <div className="form-group mx-2">
          <DatePicker className="form-control"
            placeholderText="plan"
            dateFormat="dd.MM.yyyy"
            selected={this.state.certReceivedOnPlanDate ? new Date(dateConverter(this.state.certReceivedOnPlanDate)) : undefined}
            onChange={(date: Date) => this.handleDateChange(date, 'certReceivedOnPlanDate')}
        />
        </div>
        <div className="form-group mx-2">
          <DatePicker className="form-control"
            placeholderText="fact"
            dateFormat="dd.MM.yyyy"
            selected={this.state.certReceivedOnRealDate ? new Date(dateConverter(this.state.certReceivedOnRealDate)) : undefined}
            onChange={(date: Date) => this.handleDateChange(date, 'certReceivedOnRealDate')}
          />
        </div>
      </div>
    </>
  }

  renderPayments() {
    return <>
      <div className="d-flex justify-content-center">
        <Price value={this.state.price} id='price' label="Payment #1"handleChange={this.handleChange} />
        <Paid
          id='paid'
          checkboxState={this.state.paid}
          date={this.state.paymentDate}
          handleChange={(date : any) => this.handleDateChange(date, 'paymentDate')}
          handleCheckboxChange={(e : any) => {
            if (!e.target.checked) {
              this.setState({ paymentDate: null});
            }
            this.handleCheckboxChange(e);
            }
          }
        />
        <Pi
          id="proformaReceived"
          checkboxState={this.state.proformaReceived}
          proformaReceivedDate={this.state.proformaReceived}
          date={this.state.proformaReceivedDate}
          handleCheckboxChange={(e : any) => {
            if (!e.target.checked) {
              this.setState({ proformaReceivedDate: '', proformaNumber: '' });
            }
            this.handleCheckboxChange(e);
          }
        }
        handleDateChange={(date : any) => this.handleDateChange(date, 'proformaReceivedDate')}
        handleNumberChange={(e : any) => this.handleChange(e)}
        numberId={'proformaNumber'}
        number={this.state.proformaNumber}
        />
      </div>

      <div className="d-flex justify-content-center">
          <Price value={this.state.price2} id='price2' label="Payment #2" handleChange={this.handleChange}/>
          <Paid
            id='paid2'
            checkboxState={this.state.paid2}
            date={this.state.paymentDate2}
            handleChange={(date: Date) => this.handleDateChange(date, 'paymentDate2')}
            handleCheckboxChange={(e : any) => {
              if (!e.target.checked) {
                this.setState({ paymentDate2: null});
              }
              this.handleCheckboxChange(e);
              }
            }
          />
          <Pi
            id="proformaReceived2"
            checkboxState={this.state.proformaReceived2}
            proformaReceivedDate={this.state.proformaReceived2}
            date={this.state.proformaReceivedDate2}
            handleCheckboxChange={(e: any) => {
              if (!e.target.checked) {
                this.setState({ proformaReceivedDate2: '', proformaNumber2: '' });
              }
              this.handleCheckboxChange(e);
            }
            }
            handleDateChange={(date: Date) => this.handleDateChange(date, 'proformaReceivedDate2')}
            handleNumberChange={(e: React.SyntheticEvent) => this.handleChange(e) }
            numberId={'proformaNumber2'}
            number={this.state.proformaNumber2}
          />
      </div>
    </>
  }

  renderStandards() {
    return <Standards standards={this.state.standards} standardsResult={this.state.standardsResult}
      resultChange={
        ({ currentTarget }: any) => {
          const standardsResult = { ...this.state.standardsResult, [currentTarget.dataset.standard]: currentTarget.value }
          this.setState({ standardsResult });
        }
      }
    />;
  }

  renderFormFooter() {
    return <div className="mt-2 d-flex justify-content-around form-row">
      <div className="col-2">
        <button type="submit"
          className="btn btn-danger btn-block"
        >Create / Update</button>
      </div>
      <Export type="pdf" data={this.state}/>
      {/* <Export type="xls" data={this.state}/> */}
    </div>
  }

  render = () => 
    <div className="container">
      <Notification status={this.state.requestStatus} />
      <form onSubmit={(e) => this.handleCert(e)}>
        <nav className="mt-4">
          <div className="nav nav-tabs" id="nav-tab" role="tablist">
            <a className="nav-item nav-link active" id="nav-basicInfo-tab" data-toggle="tab" href="#nav-basicInfo" role="tab" aria-controls="nav-basicInfo" aria-selected="true">Basic Info</a>
            <a className="nav-item nav-link" id="nav-dates-tab" data-toggle="tab" href="#nav-dates" role="tab" aria-controls="nav-dates" aria-selected="false">Dates</a>
            <a className="nav-item nav-link" id="nav-payments-tab" data-toggle="tab" href="#nav-payments" role="tab" aria-controls="nav-payments" aria-selected="false">Payments</a>
            <a className="nav-item nav-link" id="nav-Standards-tab" data-toggle="tab" href="#nav-Standards" role="tab" aria-controls="nav-Standards" aria-selected="false">Standards</a>
            <a className="nav-item nav-link" id="nav-comments-tab" data-toggle="tab" href="#nav-comments" role="tab" aria-controls="nav-comments" aria-selected="false">Comments</a>
          </div>
        </nav>
        <div className="tab-content mt-3" id="nav-tabContent">
          <div className="tab-pane fade show active" id="nav-basicInfo" role="tabpanel" aria-labelledby="nav-basicInfo-tab">
            {this.renderBasicInfo()}
          </div>
          <div className="tab-pane fade" id="nav-dates" role="tabpanel" aria-labelledby="nav-dates-tab">
            {this.renderDates()}
          </div>
          <div className="tab-pane fade" id="nav-payments" role="tabpanel" aria-labelledby="nav-payments-tab">
            {this.renderPayments()}
          </div>
          <div className="tab-pane fade" id="nav-Standards" role="tabpanel" aria-labelledby="nav-Standards-tab">
            {this.renderStandards()}
          </div>
          <div className="tab-pane fade" id="nav-comments" role="tabpanel" aria-labelledby="nav-comments-tab">
            <div className="form-row">
              <label htmlFor='comments'>Comments:</label>
              <textarea className='form-control' value={this.state.comments} id='comments' rows={Number('15')} onChange={this.handleChange} />
            </div>
          </div>
          {this.renderFormFooter()}
        </div>
      </form>
    </div>
}

export { select_options };