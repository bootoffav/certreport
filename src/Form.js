import React from 'react';
import B24, { parse } from './B24.js';


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
        if (props.match.params.id) {
            new B24().get_task(props.match.params.id)
              .then(response => {
                let parsed = parse(response);
                console.log(parsed);
                this.setState({ ...parsed });
              });
            this.state = {task_id: props.match.params.id};
        } else {
          this.state = { ...default_state };
        }
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
          .then(() => this.setState({cert_updated: 'success'}))
          .catch(() => this.setState({cert_updated: 'failure'}))
        : b24.create_task(this.state)
          .then(() => {
            this.setState({cert_created: 'success'});
          })
          .catch(() => this.setState({cert_created: 'failure'}))
        ;
      }
      setTimeout(() => window.location.replace("/"), 4000);
    }

    notify() {
      if (this.state.cert_updated !== undefined) {
        return (this.state.cert_updated === 'success')
        ?
            <div className="alert alert-success" role="alert">
              <h4 className="alert-heading">Certificate status successfully updated!</h4>
              <p>You are being redirected to dashboard!</p>
            </div>
        :
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Certification update failed!</h4>
              <p>Try to update a bit later!</p>
            </div>;
      }

      if (this.state.cert_created !== undefined) {
        return (this.state.cert_created === 'success')
        ?
            <div className="alert alert-success" role="alert">
              <h4 className="alert-heading">Certification task successfully created!</h4>
              <p>You are being redirected to dashboard!</p>
            </div>
        :
            <div className="alert alert-danger" role="alert">
              <h4 className="alert-heading">Certification task creation failed!</h4>
              <p>Try to update a bit later!</p>
            </div>;
      }

    }

    render() {
        return (
          <div className="form-place">
            { (this.state.cert_created) ? this.notify(): ''}
            { (this.state.cert_updated) ? this.notify(): ''}
            <form onSubmit={(e) => this.handleCert(e)}>
                <div className="form-row">
                  <div className="col">
                    <div className="form-group">
                      <label htmlFor="applicantName">
                        Name of applicant
                      </label>
                      <input required
                        className="form-control form-control-lg"
                        name="applicantName" id="applicantName"
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
                  <input className="form-control" required
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
                  <input className="form-control" required
                    type="date"
                    id="sentOn"
                    value={this.state.sentOn}
                    onChange={this.handleChange}/>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-md-2">
                  <p>to be received on:</p>
                </div>
                <div className="col-md-3">
                  <input className="form-control" required
                  type="date"
                  id="receivedOn"
                  value={this.state.receivedOn}
                  onChange={this.handleChange}/>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-md-2">
                  <p>tests to be started on:</p>
                </div>
                <div className="col-md-3">
                  <input className="form-control" required
                  type="date"
                  id="startedOn"
                  value={this.state.startedOn}
                  onChange={this.handleChange}/>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-md-2">
                  <p>tests to be finished on:</p>
                </div>
                <div className="col-md-3">
                  <input className="form-control" required
                    type="date"
                    id="finishedOn"
                    value={this.state.finishedOn}
                    onChange={this.handleChange}/>
                </div>
              </div>

              <div className="form-group row">
                <div className="col-md-2">
                  <p>results to be received on:</p>
                </div>
                <div className="col-md-3">
                  <input className="form-control" required
                  type="date"
                  id="resultsReceived"
                  value={this.state.resultsReceived}
                  onChange={this.handleChange}/>
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