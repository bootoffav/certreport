import React from 'react';
import { PickDate, BaseInput, Article, Price, Paid, Pi, SecondPayment } from "./FormFields";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import B24 from '../../B24';
import Notification from '../Notification/Notification';
import SerialNumber from '../SerialNumber/SerialNumber';
import m from 'moment';
import { select_options, emptyState } from '../../defaults';
import { IState } from '../../defaults';
import Export from '../Export/Export';


interface IFormState extends IState {
  requestStatus: boolean | null;
}

export default class Form extends React.Component {
  task_id : string;
  props : {
    match: {
      path: string;
      url: string;
    };
    location: {
      state : string;
    };
  }
  state : IFormState;
  request_status: string = 'none';

  constructor(props : any) {
      super(props);
      this.props = props;
      this.task_id = props.match.params.id || null;
      this.state = { ...props.location.state || emptyState };
      this.state.requestStatus = null;
    }

    componentDidMount() {
      if (this.props.match.path === '/edit/:id' && (this.props.location.state === undefined)) {
        B24.get_task(this.task_id).then(r => this.setState({ ...r.state }));
      }
      if (!this.state.link) {
        this.setState({ link: `[URL=https://certreport.xmtextiles.com/edit/${this.task_id}/]this task[/URL]` });
      }
    }

    handleDateChange = (date : any, prop : any) => {
      date = date ? m(date) : date;
      if (prop === 'sentOn' && date) {
        let receivedOn = date.clone().add(3, 'days');
        let startedOn = receivedOn.clone().add(1, 'days');
        let finishedOn = startedOn.clone().add(this.state.testingTime, 'days');
        let resultsReceived = finishedOn.clone().add(1, 'days');
        this.setState({receivedOn, startedOn, finishedOn, resultsReceived});
      }

      this.setState({
        [prop]: date
      });
    }

    handleCheckboxChange = (e : any) => this.setState({ [e.target.id]: e.target.checked })

    handleSelectChange = (selected : any, id : string) => {
      Array.isArray(selected)
      ? this.setState({
          [id]: selected.reduce(
          (endValue, currentValue, index) => index === selected.length - 1
            ? `${endValue}${currentValue.label}`
            : `${endValue}${currentValue.label}, `, '')
        })
      : this.setState({ [id]: selected.value })
    }

    handleChange = (e : any) => this.setState({[e.target.id]: e.target.value});

    handleCert (e : any) {
      e.preventDefault();
      if (window.confirm('Are you sure?')) {
        (this.task_id)
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
    this.setState({ requestStatus: true });
    // SerialNumber.update(Number(this.state.serialNumber) + 1);
    sessionStorage.removeItem('tasks');
    setTimeout(() => window.location.replace("/"), 4000);
  }

  afterUnsuccessfulSubmit() {
    this.setState({ requestStatus: false });
    setTimeout(() => this.setState({
      request_status: ''
    }), 3000);
  }
    render() {
        return (
          <div className="form-place">
            {(this.state.requestStatus !== null)
              ? <Notification result={this.state.requestStatus}/>
              : ''}
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
                    paymentDate={this.state.paymentDate}
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
                      paymentDate={this.state.paymentDate2}
                      handleChange={(date : any) => this.handleDateChange(date, 'paymentDate2')}
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
                      handleCheckboxChange={(e : any) => {
                        if (!e.target.checked) {
                          this.setState({ proformaReceivedDate2: '', proformaNumber2: '' });
                        }
                        this.handleCheckboxChange(e);
                        }
                      }
                      handleDateChange={(date : any) => this.handleDateChange(date, 'proformaReceivedDate2')}
                      handleNumberChange={(date : any) => this.handleChange(date)}
                      numberId={'proformaNumber2'}
                      number={this.state.proformaNumber2}
                    />
                  </SecondPayment>
                </div>
              </div>
                <div className="form-row">
                  <Article col='col' value={this.asSelectable(this.state.article)}
                    options={select_options.articles}
                    handleChange={(e : any) => this.handleSelectChange([e], 'article')}
                    handleSlaveChange={(product : any, code : any, brand : any) => {
                      this.setState({ product, code, brand });
                    }}
                  />
                  <BaseInput value={this.state.product} id='product' col="col-4" label='Product' handleChange={this.handleChange} />
                  <BaseInput value={this.state.code} id='code' label='Code' handleChange={this.handleChange} />
                  <BaseInput value={this.state.colour} id='colour' label='Colour' handleChange={this.handleChange} />
                  <BaseInput value={this.state.testReport} id='testReport' label='Test Report' handleChange={this.handleChange} />
                  <BaseInput value={this.state.certificate} id='certificate' label='Certificate' handleChange={this.handleChange} />
                  <BaseInput value={this.state.materialNeeded} id='materialNeeded' label='Material needed' handleChange={this.handleChange} />
                </div>
                <div className="form-row">
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
                  <BaseInput value={this.state.pretreatment1} id='pretreatment1' label='Pre-treatment 1' handleChange={this.handleChange} />
                  <BaseInput value={this.state.pretreatment2} id='pretreatment2' label='Pre-treatment 2' handleChange={this.handleChange} />
                  <BaseInput value={this.state.pretreatment3} id='pretreatment3' label='Pre-treatment 3' handleChange={this.handleChange} />
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
                <PickDate date={this.state.readyOn} label='Sample ready on:'
                  handleChange={(date : any) => this.handleDateChange(date, 'readyOn')}/>
                <PickDate date={this.state.sentOn} label='Sent on:'
                  handleChange={(date : any) => this.handleDateChange(date, 'sentOn')}/>
                <PickDate date={this.state.receivedOn} label='Received on:'
                  handleChange={(date : any) => this.handleDateChange(date, 'receivedOn')}/>
                <PickDate date={this.state.startedOn} label='Started on:'
                  handleChange={(date : any) => this.handleDateChange(date, 'startedOn')}/>
                <PickDate date={this.state.finishedOn} label='Finished on:'
                  handleChange={(date : any) => this.handleDateChange(date, 'finishedOn')}/>
                <PickDate date={this.state.resultsReceived} label='Results received on:'
                  handleChange={(date : any) => this.handleDateChange(date, 'resultsReceived')}/>
              </div>
              <div className="form-row">
                  <label htmlFor='comments'>Comments:</label>
                  <textarea className='form-control' value={this.state.comments} id='comments' rows={Number('15')} onChange={this.handleChange} />
              </div>
              <div className="form-row">
                <div className="col">
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