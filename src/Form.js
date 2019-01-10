import React from 'react';
import { PickDate, BaseInput, Article } from "./FormFields.js";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import B24 from './B24.js';
import Notification from './Notification.js';
import handlePDF from './PDF.js';
import SerialNumber from './SerialNumber.js';
import m from 'moment';
import { select_options, empty_state } from './defaults';

export default class Form extends React.Component {
    task_id = this.props.match.params.id || null;
    state = this.props.location.state || { ...empty_state };

    handleDateChange = (date, prop_name) => {
      date = m(date);
      if (prop_name === 'sentOn') {
        let receivedOn = date.clone().add(3, 'days');
        let startedOn = receivedOn.clone().add(1, 'days');
        let finishedOn = startedOn.clone().add(this.state.testingTime, 'days');
        let resultsReceived = finishedOn.clone().add(1, 'days');
        this.setState({
          sentOn: date,
          receivedOn, startedOn, finishedOn, resultsReceived
        });
      } else {
        this.setState({
          [prop_name]: date
        });
      }
    }

    handleSelectChange = (selected, id) => {
      (selected)
      ? this.setState({ [id]: selected })
      : this.setState({ id: selected });
    }

    handleChange = e => this.setState({[e.target.id]: e.target.value});

    handleCert (e){
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

    afterSuccessfulSubmit() {
      this.setState({request_status: 'success'});
      SerialNumber.update(Number(this.state.serialNumber) + 1);
      setTimeout(() => window.location.replace("/"), 4000);
    }

    afterUnsuccessfulSubmit() {
      this.setState({request_status: 'failure'})
      setTimeout(() => this.setState({
        request_status: ''
      }), 3000);
    }
    render() {
      const request_status = this.state.request_status || null;
        return (
          <div className="form-place">
            {(request_status)
              ? <Notification result={request_status}/>
              : ''}
            <form onSubmit={(e) => this.handleCert(e)}>
                <div className="form-row">
                  <BaseInput value={this.state.applicantName} placeholder='SHANGHAI XM GROUP LTD' col='col' id='applicantName' label='Applicant name' handleChange={this.handleChange} />
                  <div className="col">
                    <div className="form-group">
                      Testing company
                      <Select required={true} value={this.state.testingCompany} onChange={e => this.handleSelectChange(e, 'testingCompany')}
                        options={select_options.testingCompany}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      Standards
                      <Select isMulti required value={this.state.standard} onChange={e => this.handleSelectChange(e, 'standard')}
                        options={select_options.standard}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-row">
                  <Article value={this.state.article}
                    handleChange={this.handleSelectChange}
                    handleSlaveChange={(product, code, brand) => {
                      this.setState({ product, code, brand });
                    }}
                  />
                  <BaseInput value={this.state.product} id='product' col="col-4" label='Product' handleChange={this.handleChange} />
                  <BaseInput value={this.state.code} id='code' label='Code' handleChange={this.handleChange} />
                  <BaseInput value={this.state.colour} id='colour' label='Colour' handleChange={this.handleChange} />
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
                      <SerialNumber serialNumber={this.state.serialNumber} handleChange={this.handleChange} handleInit={v => this.setState({serialNumber: v})} url={this.props.match.url}/>
                    </div>
                  </div>

                </div>
              <div className="form-row">
                <div className="col">
                  <div className="form-group">
                    Brand
                    <Select value={this.state.brand} onChange={e => this.handleSelectChange(e, 'brand')}
                      options={select_options.brand}
                    />
                  </div>
                </div>
                <PickDate date={this.state.sentOn} label='Sent on:'
                  handleChange={date => this.handleDateChange(date, 'sentOn')}/>
                <PickDate date={this.state.receivedOn} label='Received on:'
                  handleChange={date => this.handleDateChange(date, 'receivedOn')}/>
                <PickDate date={this.state.startedOn} label='Started on:'
                  handleChange={date => this.handleDateChange(date, 'startedOn')}/>
                <PickDate date={this.state.finishedOn} label='Finished on:'
                  handleChange={date => this.handleDateChange(date, 'finishedOn')}/>
                <PickDate date={this.state.resultsReceived} label='Results received on:'
                  handleChange={date => this.handleDateChange(date, 'resultsReceived')}/>
              </div>
              <div className="form-row">
                <div className="col">
                  <button type="submit"
                    className="btn btn-danger btn-block"
                  >Create / Update</button>
                </div>
                <div className="col">
                  <button className="btn btn-info btn-block"
                    onClick={(e) => handlePDF(e, this.state)}
                  >Get .PDF</button>
                </div>
              </div>
          </form>
      </div>
        )
    }
}

export { select_options };