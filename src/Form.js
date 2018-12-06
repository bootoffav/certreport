import React from 'react';
import DatePicker from "react-datepicker";
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import B24, { parse } from './B24.js';
import Notification from './Notification.js';


const default_state = {
  applicantName: 'SHANGHAI XM GROUP LTD',
  product: '60% Modacrylic, 39%Cotton, 1%AS 280gsm',
  code: '60MA/39C/1AS-280 FR-Knit',
  article: 'FR-Fleece-280',
  colour: 'Dark Navy',
  length: 1,
  width: 1.5,
  partNumber: 'partNumber 1493',
  rollNumber: 'rollNumber 1395',
  tester: `AITEX Headquarters
Plaza Emilio Sala 1, 03801 Alcoy (Alicante) Spain.
Tel.: +34 965 542 200
Fax.: +34 965 543 494
Attn.: Ms Marian Domingo`,
  materialNeeded: '1 lineal meters',
  testingTime: 21,
  iso: 'ISO 17493',
}


export default class Form extends React.Component {
    constructor (props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.state = { ...default_state };
        if (props.match.params.id) {
            new B24().get_task(props.match.params.id)
              .then(response => {
                const stateFromAPI = parse(response);
                this.setState({ ...stateFromAPI, task_id: props.match.params.id});
              });
        }
    }
    handleDateChange(date, prop_name) {
      this.setState({
        [prop_name]: date
      });
    }
    handleChange(e) {
      this.setState({[e.target.id]: e.target.value});
    }
    handleCert (e){
      e.preventDefault();
      if (window.confirm('Are you sure?')) {
        const b24 = new B24();
        (this.state.task_id)
        ? b24.update_task(this.state)
          .then(() => this.setState({request_status: 'success'}))
          .catch(() => this.setState({request_status: 'failure'}))
        : b24.create_task(this.state)
          .then(() => this.setState({request_status: 'success'}))
          .catch(() => this.setState({request_status: 'failure'}))
        ;
      }
      // setTimeout(() => window.location.replace("/"), 4000);
    }

    render() {
        return (
          <div className="form-place">
            {(this.state.request_status)
              ? 
                <Notification
                  result={this.state.request_status}
                />
              : ''}

            <form onSubmit={(e) => this.handleCert(e)}>
                <div className="form-row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="applicantName">
                        Name of applicant
                      </label>
                      <input type="text" required
                        className="form-control form-control-lg"
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
                      <label htmlFor="product">
                        Product
                      </label>
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
                      <label htmlFor="code">
                        Code
                      </label>
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
                      <label htmlFor="article">Article</label>
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
                      <label htmlFor="article">Colour</label>
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
              </div> {/* Product, Code, Article, Colour */}
              <div className="form-row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="article">Length of sample, meters</label>
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
                    <label htmlFor="article">Width of sample, meters</label>
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
                    <label htmlFor="article">Part Number</label>
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
                    <label htmlFor="article">Roll number</label>
                    <input required
                      className="form-control"
                      id="rollNumber"
                      value={this.state.rollNumber}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="form-row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label htmlFor="iso">ISO</label>
                    <input required
                      className="form-control isoColour"
                      id="iso"
                      value={this.state.iso}
                      onChange={this.handleChange}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="tester">Tester company address</label>
                  <textarea className="form-control" id="tester" rows="5" cols="150" required
                    value={this.state.tester}
                    onChange={this.handleChange}
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-md-2">
                  <p>Material needed:</p>
                </div>
                <div className="col-md-3">
                  <input className="form-control" type="text" required
                  id="materialNeeded"
                  value={this.state.materialNeeded}
                  onChange={this.handleChange}/>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-md-2">
                  <p>testing time, days:</p>
                </div>
                <div className="col-md-3">
                  <input required
                  className="form-control"
                  type="number"
                  id="testingTime"
                  value={this.state.testingTime}
                  onChange={this.handleChange}/>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-md-2">
                  <p>to be sent on:</p>
                </div>
                <div className="col-md-3">
                    <DatePicker className="form-control" required
                      selected={this.state.sentOn}
                      dateFormat="ddMMMyyyy"
                      onChange={date => this.handleDateChange(date, 'sentOn')}
                    />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-md-2">
                  <p>to be received on:</p>
                </div>
                <div className="col-md-3">
                  <DatePicker className="form-control" required
                    selected={this.state.receivedOn}
                    dateFormat="ddMMMyyyy"
                    onChange={date => this.handleDateChange(date, 'receivedOn')}
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-md-2">
                  <p>tests to be started on:</p>
                </div>
                <div className="col-md-3">
                  <DatePicker className="form-control" required
                    selected={this.state.startedOn}
                    dateFormat="ddMMMyyyy"
                    onChange={date => this.handleDateChange(date, 'startedOn')}
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-md-2">
                  <p>tests to be finished on:</p>
                </div>
                <div className="col-md-3">
                <DatePicker className="form-control" required
                    selected={this.state.finishedOn}
                    dateFormat="ddMMMyyyy"
                    onChange={date => this.handleDateChange(date, 'finishedOn')}
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="col-md-2">
                  <p>results to be received on:</p>
                </div>
                <div className="col-md-3">
                <DatePicker className="form-control" required
                    selected={this.state.resultsReceived}
                    dateFormat="ddMMMyyyy"
                    onChange={date => this.handleDateChange(date, 'resultsReceived')}
                  />
                </div>
              </div>

              <div className="form-group row">
                <div className="row col-4 offset-4">
                  <button type="submit"
                    className="btn btn-danger btn-block"
                  >Create / Update</button>
                </div>
              </div>
          </form>
      </div>
        )
    }
}