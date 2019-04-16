import React, { DOMElement } from 'react';
import { PickDate, BaseInput, Article, Price, Paid, Pi, SecondPayment } from "./FormFields";
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
    render() {
        return (
          <div className="mt-3">
            <Notification status={this.state.requestStatus} />
            <form onSubmit={(e) => this.handleCert(e)}>
              <div className="form-row">
                <BaseInput value={this.state.applicantName} placeholder='SHANGHAI XM GROUP LTD' col="col-2" id='applicantName' label='Applicant name' handleChange={this.handleChange} />
                <div className="col-2">
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
                <div className="col-2">
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
                <div className="col-1">
                  <Price value={this.state.price} id='price' handleChange={this.handleChange} />
                </div>
                <div className="col-auto">
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
                </div>
                <div className="col">
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
                <div className="col-auto">
                  <SecondPayment>
                    <Price value={this.state.price2} id='price2' handleChange={this.handleChange}/>
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
                  </SecondPayment>
                </div>
              </div>
                <div className="form-row">
                <Article col='col' value={this.asSelectable(this.state.article)}
                  options={select_options.articles}
                  handleChange={(e: any) => this.handleSelectChange([e], 'article')}
                  handleSlaveChange={ ({product, code, brand}) => this.setState({ product, code, brand }) }
                  />
                  <BaseInput value={this.state.product} id='product' col="col-4" label='Product' handleChange={this.handleChange} />
                  <BaseInput value={this.state.code} id='code' label='Code' handleChange={this.handleChange} />
                  <BaseInput value={this.state.colour} id='colour' label='Colour' handleChange={this.handleChange} />
                  <BaseInput value={this.state.testReport} id='testReport' required={false} label='Test Report' handleChange={this.handleChange} />
                  <BaseInput value={this.state.certificate} id='certificate' required={false} label='Certificate' handleChange={this.handleChange} />
                  <BaseInput value={this.state.materialNeeded} id='materialNeeded' label='Material needed' handleChange={this.handleChange} />
                </div>
              <div className="form-row">
                <div className="col">
                  <div className="form-group">
                    Brand
                    <Select value={this.asSelectable(this.state.brand)} onChange={e => this.handleSelectChange([e], 'brand')}
                      options={select_options.brand}
                    />
                  </div>
                </div>
                <BaseInput value={this.state.length} id='length' label='Sample length (m)' handleChange={this.handleChange} />
                <BaseInput value={this.state.width} id='width' label='Sample width (m)' handleChange={this.handleChange} />
                <BaseInput value={this.state.partNumber} id='partNumber' label='Part number' handleChange={this.handleChange} />
                <BaseInput value={this.state.rollNumber} id='rollNumber' label='Roll number' handleChange={this.handleChange} />
                <BaseInput value={this.state.testingTime} id='testingTime' label='Testing Time' handleChange={this.handleChange} />
                <div className="col">
                  <div className="from-group">
                    <SerialNumber
                      serialNumber={this.state.serialNumber}
                      handleChange={this.handleChange}
                      handleInit={(v : any) => this.setState({serialNumber: v})} url={this.props.match.url}/>
                  </div>
                </div>
              </div>
                <div className="form-row">
                  <div className='col'>
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
                  <BaseInput value={this.state.pretreatment2} id='pretreatment2' label='Pre-treatment 2' handleChange={this.handleChange} />
                  <BaseInput value={this.state.pretreatment3} id='pretreatment3' label='Pre-treatment 3' handleChange={this.handleChange} />
                </div>
              <div className="form-row">
                <PickDate date={this.state.readyOn} label='Sample to be prepared:'
                  handleChange={(date: Date) => this.handleDateChange(date, 'readyOn')}/>
                <PickDate date={this.state.sentOn} label='Sample has sent:'
                  handleChange={(date: Date) => this.handleDateChange(date, 'sentOn')}/>
                <PickDate date={this.state.receivedOn} label='Sample has received by lab:'
                  handleChange={(date: Date) => this.handleDateChange(date, 'receivedOn')}/>
                <PickDate date={this.state.startedOn} label='Test is started:'
                  handleChange={(date: Date) => this.handleDateChange(date, 'startedOn')} />
                <div className="col-3">
                  <div style={{ textAlign: 'center' }}>Tests to be finished / really finished on:</div>
                  <div className="input-group">
                    <DatePicker className="form-control"
                      placeholderText="plan"
                      dateFormat="dd.MM.yyyy"
                      selected={this.state.testFinishedOnPlanDate ? new Date(dateConverter(this.state.testFinishedOnPlanDate)) : undefined}
                      onChange={(date : Date) => this.handleDateChange(date, 'testFinishedOnPlanDate')}
                      />
                    <DatePicker className="form-control"
                      placeholderText="fact"
                      dateFormat="dd.MM.yyyy"
                      selected={this.state.testFinishedOnRealDate ? new Date(dateConverter(this.state.testFinishedOnRealDate)) : undefined}
                      onChange={(date: Date) => this.handleDateChange(date, 'testFinishedOnRealDate')}
                      />
                  </div>
                </div>
                <div className="col-3">
                  <div style={{ textAlign: 'center' }}>Certificate to be received / really received on:</div>
                  <div className="input-group">
                    <DatePicker className="form-control"
                      placeholderText="plan"
                      dateFormat="dd.MM.yyyy"
                      selected={this.state.certReceivedOnPlanDate ? new Date(dateConverter(this.state.certReceivedOnPlanDate)) : undefined}
                      onChange={(date: Date) => this.handleDateChange(date, 'certReceivedOnPlanDate')}
                    />
                    <DatePicker className="form-control"
                      placeholderText="fact"
                      dateFormat="dd.MM.yyyy"
                      selected={this.state.certReceivedOnRealDate ? new Date(dateConverter(this.state.certReceivedOnRealDate)) : undefined}
                      onChange={(date: Date) => this.handleDateChange(date, 'certReceivedOnRealDate')}
                    />
                  </div>
                </div>
              </div>
              <div className="form-row d-flex justify-content-between">
                <div className="col-2">
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
                <div className="col-auto">
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
              <div className="form-row">
                  <label htmlFor='comments'>Comments:</label>
                  <textarea className='form-control' value={this.state.comments} id='comments' rows={Number('15')} onChange={this.handleChange} />
              </div>
              <div className="mt-2 d-flex justify-content-around form-row">
                <div className="col-2">
                  <button type="submit"
                    className="btn btn-danger btn-block"
                  >Create / Update</button>
                </div>
                <Export type="pdf" data={this.state}/>
                {/* <Export type="xls" data={this.state}/> */}
              </div>
          </form>
      </div>
        )
    }
}

export { select_options };