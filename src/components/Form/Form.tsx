import React from 'react';
import swal from 'sweetalert';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import dayjs from 'dayjs';
import { PickDate, BaseInput, Article, Price, Paid, Pi } from "./FormFields";
import B24 from '../../B24';
import Notification, { Status } from '../Notification/Notification';
import SerialNumber from '../SerialNumber/SerialNumber';
import { selectOptions, emptyState, IState } from '../../defaults';
import Export from '../Export/Export';
import Standards from '../Standards/Standards';
import FileUploads from '../FileUploads/FileUploads';
import FabricApplicationForm from './FabricApplicationForm';
import { DB } from '../../DBManager';
import { removeEmptyProps } from '../../helpers';
import { TabbedCard, Tab } from 'tabler-react';

interface IFormState extends IState {
  requestStatus: Status;
  EN11612Detail?: any;
  hasError: boolean;
  existsInDB?: boolean;
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

class Form extends React.Component<IFormProps> {
  task_id: string | undefined;
  state: IFormState;

  constructor(props: IFormProps) {
    super(props);
    this.task_id = props.match.params.id;
    this.state = props.location.state || emptyState;
    this.state.requestStatus = Status.FillingForm;
  }

  componentDidUpdate = () => {
    if (this.state.hasError) throw new Error('Task not found');
  }
  
  async componentDidMount() {
    if (this.task_id && this.props.location.state === undefined) {
      const dataFromDB = await DB.getData(this.task_id)
        .then(({ EN11612Detail, exists, ...DBState }: any) => ({ EN11612Detail, DBState, exists }));

      B24.get_task(this.task_id)
        .then(r => this.setState({
          ...r.state,
          link: `[URL=certreport.xmtextiles.com/edit/${this.task_id}/]this task[/URL]`,
          DBState: dataFromDB.DBState,
          EN11612Detail: dataFromDB.EN11612Detail,
          existsInDB: dataFromDB.exists
        }))
        .catch((e) => this.setState({ hasError: true }));
    }
  }

  handleDateChange = (date: Date | null, prop: string): void =>
    this.setState({ [prop]: date === null ? '' : dayjs(date).format('DDMMMYYYY') });


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

  handleChange = (e: any) => ['price', 'price2'].includes(e.target.id) ? this.setState({ [e.target.id]: e.target.value.replace(',', '.') }) : this.setState({ [e.target.id]: e.target.value });

  async handleCert(e: any) {
    e.preventDefault();
    const OK = await swal({
      title: "Are you sure?",
      icon: "info",
      buttons: ["Cancel", "OK"]
    });

    if (OK) {
      this.setState({ requestStatus: Status.Loading });
      const taskId = this.task_id
        ? await B24.updateTask(this.state, this.task_id).then(_ => this.task_id)
        : await B24.createTask(this.state);
      this.state.existsInDB
        ? DB.updateInstance(taskId, { ...this.state.DBState, EN11612Detail: this.state.EN11612Detail }).then(this.successfullySubmitted).catch(this.unsuccessfullySubmitted)
        : DB.createInstance(taskId, this.state.DBState).then(this.successfullySubmitted).catch(this.unsuccessfullySubmitted)
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

  successfullySubmitted = () => {
    this.setState({ requestStatus: Status.Success });
    sessionStorage.removeItem('tasks');
    setTimeout(() => {
      window.history.length === 1
      ? window.close()
      : window.location.assign('/');
    }, 3000);
  }

  unsuccessfullySubmitted = (error: any) => {
    console.log(error);
    this.setState({ requestStatus: Status.Failure });
    setTimeout(() => this.setState({
      requestStatus: Status.FillingForm
    }), 3000);
  }

  renderBasicInfo = () =>
    <>
    <div className="d-flex">
      <BaseInput value={this.state.applicantName} placeholder='SHANGHAI XM GROUP LTD' id='applicantName' label='Applicant name' handleChange={this.handleChange} />
      <div className="w-25 mx-2">
        <div className="form-group">
          Testing company
          <Select
            value={this.asSelectable(this.state.testingCompany)}
            onChange={(e: any) => {
              this.handleSelectChange(e, 'testingCompany')}
            }
            options={selectOptions.testingCompany}
          />
        </div>
      </div>
      <div className="w-25">
        <div className="form-group">
          Standards
          <Select isMulti
            value={this.asSelectable(this.state.standards)}
            onChange={(e: any) => {
              this.handleSelectChange(e, 'standards')}
            }
            options={selectOptions.standards}
          />
        </div>
      </div>
      <div className="w-25 mx-2">
        <div className="form-group">
          Stage
          <Select
            value={this.asSelectable(this.state.stage)}
            onChange={(e: any) => {
              this.handleSelectChange(e, 'stage')}
            }
            options={selectOptions.stages}
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
        options={selectOptions.articles}
        handleChange={(e: any) => this.handleSelectChange([e], 'article')}
        handleSlaveChange={ (product, code, brand) => this.setState({ product, code, brand }) }
        />
      </div>
      <BaseInput value={this.state.product} className="ml-2 flex-grow-1" id='product' label='Product' handleChange={this.handleChange} />
      <BaseInput value={this.state.code} className="ml-2" id='code' label='Code' handleChange={this.handleChange} />
      <BaseInput value={this.state.colour} className="ml-2" id='colour' label='Colour' handleChange={this.handleChange} />
    </div>

    <div className="d-flex">
      <div className="flex-grow-1">
        Brand
        <Select value={this.asSelectable(this.state.brand)} onChange={(e: any) => this.handleSelectChange([e], 'brand')}
          options={selectOptions.brand}
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
            <div className="input-group-text pretreatment1Result">
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
            <button type="button"
              className="btn btn-sm btn-link btn-reset"
              onClick={() => this.setState({ pretreatment1Result: ''})}
              >Reset</button>
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

  renderDates = () =>
    <>
      <div className="d-flex justify-content-center m-2">
        <PickDate date={this.state.pausedUntil} label='Paused until:'
          handleChange={(date: Date) => this.handleDateChange(date, 'pausedUntil')}/>
        <PickDate date={this.state.readyOn} label='Sample to be prepared:'
          handleChange={(date: Date) => this.handleDateChange(date, 'readyOn')}/>
        <PickDate date={this.state.sentOn} label='Sample has sent:'
            handleChange={(date: Date) => this.handleDateChange(date, 'sentOn')} />
      </div>
      <div className="d-flex justify-content-center">
        <PickDate date={this.state.receivedOn} label='Sample has received by lab:'
          handleChange={(date: Date) => this.handleDateChange(date, 'receivedOn')}/>
        <PickDate date={this.state.startedOn} label='Test is started:'
            handleChange={(date: Date) => this.handleDateChange(date, 'startedOn')} />
        <PickDate date={this.state.testFinishedOnPlanDate} label='ETD (Test-report)'
          handleChange={(date: Date) => this.handleDateChange(date, 'testFinishedOnPlanDate')} />
      </div>
      <div className="d-flex justify-content-center">
        <PickDate date={this.state.testFinishedOnRealDate} label='Test really finished on:'
          handleChange={(date: Date) => this.handleDateChange(date, 'testFinishedOnRealDate')} />
        <PickDate date={this.state.certReceivedOnPlanDate} label='ETD (Certificate)'
          handleChange={(date: Date) => this.handleDateChange(date, 'certReceivedOnPlanDate')} />
        <PickDate date={this.state.certReceivedOnRealDate} label='Certificate really received on:'
          handleChange={(date: Date) => this.handleDateChange(date, 'certReceivedOnRealDate')} />
      </div>
    </>

  renderPayments = () =>
    <>
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

  renderStandards = () =>
    <Standards standards={this.state.standards} standardsResult={this.state.standardsResult}
      EN11612Detail={this.state.EN11612Detail}
      updateParent={(state: any) => this.setState({ EN11612Detail: state})}
      resultChange={
        ({ currentTarget }: any) => {
          const standardsResult = { ...this.state.standardsResult, [currentTarget.dataset.standard]: currentTarget.value }
          removeEmptyProps(standardsResult);
          this.setState({ standardsResult });
        }
      }
    />;

  renderFormFooter = () =>
    <div className="d-flex justify-content-around form-row m-2">
      <div className="col-2">
        <button type="submit"
          className="btn btn-danger btn-block"
        >SAVE</button>
      </div>
      <Export state={this.state}/>
    </div>

  renderFileUploads() {
    return <div className="tab-pane fade" id="nav-fileUploads" role="tabpanel" aria-labelledby="nav-fileUploads-tab">
      <FileUploads taskId={this.task_id} />
    </div>;
  }

  render = () =>
    <div className="container">
      <Notification status={this.state.requestStatus} />
      <form onSubmit={(e) => this.handleCert(e)}>
        <TabbedCard initialTab="Basic Info">
          <Tab title="Basic Info">{this.renderBasicInfo()}</Tab>
          <Tab title="Dates">{this.renderDates()}</Tab>
          <Tab title="Payments">{this.renderPayments()}</Tab>
          <Tab title="Standards">{this.renderStandards()}</Tab>
          <Tab title="Fabric Application Form">
            <FabricApplicationForm
              state={this.state.DBState}
              updateParent={(DBState: any) => this.setState({ DBState })}
            />
          </Tab>
          <Tab title="Comments & News">
            <div className="form-row">
              <BaseInput value={this.state.news} className="ml-2 flex-grow-1" id='news' label="News:" handleChange={this.handleChange} />
            </div>
            <div className="form-row">
              <label htmlFor='comments'>Comments:</label>
              <textarea className='form-control' value={this.state.comments} id='comments' rows={15} onChange={this.handleChange} />
            </div>
          </Tab>
        <Tab title="File Uploads">
          <FileUploads taskId={this.task_id} />
        </Tab>
        </TabbedCard>
        {this.renderFormFooter()}
      </form>
    </div>
}

export default Form;
