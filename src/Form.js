import React from 'react';
import { PickDate, BaseInput } from "./FormFields.js";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import B24 from './B24.js';
import Notification from './Notification.js';
import handlePDF from './PDF.js';
import SerialNumber from './SerialNumber.js';
import { parseSelectable, parseDates } from './Helpers.js';
import m from 'moment';


// const init_state = {
//   applicantName: 'SHANGHAI XM GROUP LTD',
//   product: '60% Modacrylic, 39%Cotton, 1%AS 280gsm',
//   code: '60MA/39C/1AS-280 FR-Knit',
//   article: 'FR-Fleece-280',
//   colour: 'Dark Navy',
//   length: 1,
//   width: 1.5,
//   partNumber: '1493',
//   rollNumber: '1395',
//   testingCompany: [],
// // Plaza Emilio Sala 1, 03801 Alcoy (Alicante) Spain.
// // Tel.: +34 965 542 200
// // Fax.: +34 965 543 494
// // Attn.: Ms Marian Domingo`,
//   materialNeeded: '1 lineal meters',
//   testingTime: 21,
//   iso: [],
// };

const empty_state = {
  applicantName: '',
  product: '',
  code: '',
  article: '',
  colour: '',
  length: 1,
  width: 1.5,
  partNumber: '',
  rollNumber: '',
  serialNumber: '',
  testingCompany: [],
  materialNeeded: '',
  testingTime: 21,
  iso: []
};

export default class Form extends React.Component {
    task_id = this.props.match.params.id ? this.props.match.params.id : null;
    state = { ...empty_state };

    componentDidMount = () => {
      if (this.task_id) {
        B24.get_task(this.task_id)
          .then(task => this.setState({
            ...task.state,
            ...parseDates(task.state),
            testingCompany_PDF: task.state.testingCompany,
            iso_PDF: task.state.iso,
            iso: parseSelectable('iso', task.state.iso),
            testingCompany: parseSelectable('iso', task.state.testingCompany),
          }));
      // } else {
        // this.setState({ ...init_state })
      }
    }

    handleDateChange = (date, prop_name) =>
      this.setState({
        [prop_name]: m(date)
      });

    handleSelectChange = (selectedOption, id) => 
      (selectedOption)
      ? this.setState({ [id]: selectedOption })
      : this.setState({ id: selectedOption });

    handleChange = e => this.setState({[e.target.id]: e.target.value});

    handleCert (e){
      e.preventDefault();
      if (window.confirm('Are you sure?')) {
        const b24 = new B24();
        (this.task_id)
        ? b24.update_task(this.state, this.task_id)
          .then(
            () => this.afterSuccessfulSubmit(),
            () => this.afterUnsuccessfulSubmit()
          )
        : b24.create_task(this.state)
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
      const request_status = this.state.request_status;
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
                      <Select isMulti value={this.state.testingCompany} onChange={e => this.handleSelectChange(e, 'testingCompany')} id="testingCompany"
                        options={[
                          {value: 'Aitex Headquarters (Spain)', label: 'Aitex Headquarters (Spain)', id: 'testingCompany'},
                          {value: 'AITEX SHANGHAI OFFICE', label: 'AITEX SHANGHAI OFFICE', id: 'testingCompany'}
                        ]}
                      />
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      Standards
                      <Select isMulti required value={this.state.iso} onChange={e => this.handleSelectChange(e, 'iso')} id="iso"
                        options={[
                          {value: 'ISO 17893', label: 'ISO 17893', id: 'iso'},
                          {value: 'EN 11611', label: 'EN 11611', id: 'iso'},
                          {value: 'EN 11612', label: 'EN 11612', id: 'iso'},
                          {value: 'EN 1149-3', label: 'ISO 1149-3', id: 'iso'}
                        ]}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-row"> {/* Product, Code, Article, Colour */}
                  <BaseInput value={this.state.product} col='col-4' id='product' label='Product' handleChange={this.handleChange} />
                  <BaseInput value={this.state.code} id='code' label='Code' handleChange={this.handleChange} />
                  <BaseInput value={this.state.article} id='article' label='Article' handleChange={this.handleChange} />
                  <BaseInput value={this.state.colour} id='colour' label='Colour' handleChange={this.handleChange} />
                  <BaseInput value={this.state.materialNeeded} id='materialNeeded' label='Material needed' handleChange={this.handleChange} />
                </div> {/* Product, Code, Article, Colour, Material Needed */}
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