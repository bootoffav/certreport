import React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import B24 from './B24.js';
import Notification from './Notification.js';
import handlePDF from './PDF.js';
import SerialNumber from './SerialNumber.js';
import { parseSelectable, parseDates } from './Helpers.js';
import m from 'moment';


const init_state = {
  applicantName: 'SHANGHAI XM GROUP LTD',
  product: '60% Modacrylic, 39%Cotton, 1%AS 280gsm',
  code: '60MA/39C/1AS-280 FR-Knit',
  article: 'FR-Fleece-280',
  colour: 'Dark Navy',
  length: 1,
  width: 1.5,
  partNumber: 'partNumber 1493',
  rollNumber: 'rollNumber 1395',
  testingCompany: [],
// Plaza Emilio Sala 1, 03801 Alcoy (Alicante) Spain.
// Tel.: +34 965 542 200
// Fax.: +34 965 543 494
// Attn.: Ms Marian Domingo`,
  materialNeeded: '1 lineal meters',
  testingTime: 21,
  iso: [],
};

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
    constructor (props){
        super(props);
        this.task_id = props.match.params.id ? props.match.params.id : null;
        this.state = { ...empty_state };
    }

    componentDidMount() {
      if (this.task_id) {
        new B24().get_task(this.task_id).then(task => {
          console.log(parseDates(task.state));
          this.setState({
            ...task.state,
            ...parseDates(task.state),
            testingCompany_PDF: task.state.testingCompany,
            iso_PDF: task.state.iso,
            iso: parseSelectable('iso', task.state.iso),
            testingCompany: parseSelectable('iso', task.state.testingCompany),
          });
        });
      } else {
        this.setState({ ...init_state })
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
            {(this.state.request_status)
              ? 
                <Notification
                  result={request_status}
                />
              : ''}
            <form onSubmit={(e) => this.handleCert(e)}>
                <div className="form-row">
                  <div className="col">
                    <div className="form-group">
                        Name of applicant
                      <input type="text" required
                        className="form-control"
                        id="applicantName"
                        aria-describedby="applicantHelp"
                        placeholder="SHANGHAI XM GROUP LTD"
                        value={this.state.applicantName}
                        onChange={this.handleChange}
                      />
                      <small id="applicantHelp" className="form-text text-muted">
                        On behalf of what company we supply material for testing
                      </small>
                    </div>
                  </div>
                </div>
                <div className="form-row"> {/* Product, Code, Article, Colour */}
                  <div className="col-4">
                    <div className="form-group">
                        Product
                      <input required
                        className="form-control"
                        id="product"
                        aria-describedby="productHelp"
                        value={this.state.product}
                        onChange={this.handleChange}
                      />
                      <small id="applicantHelp" className="form-text text-muted">
                        60% Modacrylic, 39%Cotton, 1%AS 280gsm
                      </small>
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                        Code
                      <input required
                        className="form-control"
                        id="code"
                        aria-describedby="codeHelp"
                        value={this.state.code}
                        onChange={this.handleChange}
                      />
                      <small id="codeHelp" className="form-text text-muted">
                        60MA/39C/1AS-280 FR-Knit
                      </small>
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      Article
                      <input required
                        className="form-control"
                        id="article"
                        aria-describedby="articleHelp"
                        value={this.state.article}
                        onChange={this.handleChange}
                      />
                      <small id="articleHelp" className="form-text text-muted">
                        FR-Fleece-280
                      </small>
                    </div>
                  </div>
                  <div className="col">
                    <div className="form-group">
                      Colour
                      <input required
                        className="form-control"
                        id="colour"
                        aria-describedby="colourHelp"
                        placeholder="Dark Navy"
                        value={this.state.colour}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div className="col-md-2">
                  Material needed:
                    <input className="form-control" type="text" required
                    id="materialNeeded"
                    value={this.state.materialNeeded}
                    onChange={this.handleChange}/>
                  </div>
              </div> {/* Product, Code, Article, Colour */}
              <div className="form-row">
                <div className="col-md-3">
                  <div className="form-group">
                    Length of sample, meters
                    <input required
                      type="number"
                      className="form-control"
                      id="length"
                      value={this.state.length}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    Width of sample, meters
                    <input required
                      type="number"
                      className="form-control"
                      id="width"
                      value={this.state.width}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    Part Number
                    <input required
                      className="form-control"
                      id="partNumber"
                      value={this.state.partNumber}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    Roll number
                    <input required
                      className="form-control"
                      id="rollNumber"
                      value={this.state.rollNumber}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="form-group row">
                <div className="col-md-3">
                  Standards
                  <Select
                    isMulti
                    required
                    value={this.state.iso}
                    onChange={e => this.handleSelectChange(e, 'iso')}
                    id="iso"
                    options={[
                      {value: 'ISO 17893', label: 'ISO 17893', id: 'iso'},
                      {value: 'EN 11611', label: 'EN 11611', id: 'iso'},
                      {value: 'EN 11612', label: 'EN 11612', id: 'iso'},
                      {value: 'EN 1149-3', label: 'ISO 1149-3', id: 'iso'}
                    ]}
                  />
                </div>
              <div className="col-md-3">
                <div className="form-group">
                  Testing company
                  <Select
                      isMulti
                      value={this.state.testingCompany}
                      onChange={e => this.handleSelectChange(e, 'testingCompany')}
                      id="testingCompany"
                      options={[
                        {value: 'Aitex Headquarters (Spain)', label: 'Aitex Headquarters (Spain)', id: 'testingCompany'},
                        {value: 'AITEX SHANGHAI OFFICE', label: 'AITEX SHANGHAI OFFICE', id: 'testingCompany'}
                      ]}
                    />
                </div>
              </div>
              <div className="col-md-2">
                Days:
                <input required
                className="form-control"
                type="number"
                id="testingTime"
                value={this.state.testingTime}
                onChange={this.handleChange}/>
              </div>
              <SerialNumber serialNumber={this.state.serialNumber}
                            handleChange={this.handleChange}
                            handleInit={v => this.setState({serialNumber: v})}
                            url={this.props.match.url}
              />
            </div>

              <div className="form-row">
                <div className="col">
                  <div className="form-group">
                    Sent on:
                        <DatePicker className="form-control" required
                          selected={this.state.sentOn ? this.state.sentOn.toDate() : ''}
                          dateFormat="dd.MM.yyyy"
                          onChange={date => this.handleDateChange(date, 'sentOn')}
                          />
                  </div>
                </div>
                <div className="col">
                  <div className="form-group">
                  Received on:
                    <DatePicker className="form-control" required
                      selected={this.state.receivedOn ? this.state.receivedOn.toDate() : ''}
                      dateFormat="dd.MM.yyyy"
                      onChange={date => this.handleDateChange(date, 'receivedOn')}
                      />
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    Started on:
                      <DatePicker className="form-control" required
                        selected={this.state.startedOn ? this.state.startedOn.toDate() : ''}
                        dateFormat="dd.MM.yyyy"
                        onChange={date => this.handleDateChange(date, 'startedOn')}
                      />
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    Finished on:
                    <DatePicker className="form-control" required
                        selected={this.state.finishedOn ? this.state.finishedOn.toDate() : ''}
                        dateFormat="dd.MM.yyyy"
                        onChange={date => this.handleDateChange(date, 'finishedOn')}
                      />
                  </div>
                </div>

                <div className="col">
                  <div className="form-group">
                    Results received on:
                    <DatePicker className="form-control" required
                        selected={this.state.resultsReceived ? this.state.resultsReceived.toDate() : ''}
                        dateFormat="dd.MM.yyyy"
                        onChange={date => this.handleDateChange(date, 'resultsReceived')}
                        />
                  </div>
                </div>
              </div>
              <div className="form-group row">
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