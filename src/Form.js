import React from 'react';
import B24 from './B24.js';
import './css/style.css';
import axios from 'axios';

export default class Form extends React.Component {
    constructor (props){
        super(props);
        this.state = {
          applicantName: '',
          product: '',
          code: '',
          article: '',
          colour: '',
          length: 1,
          width: 1.5,
          partNumber: '',
          rollNumber: '',
          tester: `AITEX Headquarters
Plaza Emilio Sala 1, 03801 Alcoy (Alicante) Spain.
Tel.: +34 965 542 200
Fax.: +34 965 543 494
Attn.: Ms Marian Domingo`,
          materialNeeded: '1 lineal meters',
          testingTime: 21
        }
    }
    handleChange(e) {
      this.setState({
        [e.target.id]: e.target.value
      });
    }
    handleCertUpdate (e){
      if (window.confirm('Are you sure?')) {
        e.preventDefault();
        const b24 = new B24();
        b24.update_task(this.state);
      } else {
        console.log('trash');
      }
      e.preventDefault();
    }

    render() {
        return (
        <form className="add-form">
            <div className="form-row">
              <div className="col">
                <div className="form-group">
                  <label htmlFor="applicantName">
                    Name of applicant
                  </label>
                  <input 
                    type="text"
                    className="form-control form-control-lg"
                    id="applicantName"
                    aria-describedby="applicantHelp"
                    placeholder="SHANGHAI XM GROUP LTD"
                    value={this.state.applicantName}
                    onChange={e => this.handleChange(e)}
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
                  <input 
                    className="form-control"
                    id="product"
                    aria-describedby="productHelp"
                    value={this.state.product}
                    onChange={e => this.handleChange(e)}
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
                  <input 
                    className="form-control"
                    id="code"
                    aria-describedby="codeHelp"
                    value={this.state.code}
                    onChange={e => this.handleChange(e)}
                  />
                  <small id="codeHelp" className="form-text text-muted">
                    60MA/39C/1AS-280 FR-Knit
                  </small>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="article">Article</label>
                  <input
                    className="form-control"
                    id="article"
                    aria-describedby="articleHelp"
                    value={this.state.article}
                    onChange={e => this.handleChange(e)}
                  />
                  <small id="articleHelp" className="form-text text-muted">
                    FR-Fleece-280
                  </small>
                </div>
              </div>
              <div className="col">
                <div className="form-group">
                  <label htmlFor="article">Colour</label>
                  <input
                    className="form-control"
                    id="colour"
                    aria-describedby="colourHelp"
                    placeholder="Dark Navy"
                    value={this.state.colour}
                    onChange={e => this.handleChange(e)}
                  />
                </div>
              </div>
          </div> {/* Product, Code, Article, Colour */}
          <div className="form-row">
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="article">Length of sample, meters</label>
                <input
                  type="number"
                  className="form-control"
                  id="length"
                  value={this.state.length}
                  onChange={e => this.handleChange(e)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="article">Width of sample, meters</label>
                <input
                  type="number"
                  className="form-control"
                  id="width"
                  value={this.state.width}
                  onChange={e => this.handleChange(e)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="article">Part Number</label>
                <input
                  className="form-control"
                  id="partNumber"
                  value={this.state.partNumber}
                  onChange={e => this.handleChange(e)}
                />
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="article">Roll number</label>
                <input
                  className="form-control"
                  id="rollNumber"
                  value={this.state.rollNumber}
                  onChange={e => this.handleChange(e)}
                />
              </div>
            </div>
          </div>
          <div className="form-row">
            <div className="col-md-3">
              <div className="form-group">
                <label htmlFor="article">ISO</label>
                <input
                  className="form-control isoColour"
                  id="iso"
                  value={this.state.iso}
                  onChange={e => this.handleChange(e)}
                />
              </div>
            </div>
            <div className="col-md-6">
              <label htmlFor="tester">Tester company address</label>
              <textarea className="form-control" id="tester" rows="5" cols="150"
                value={this.state.tester}
                  onChange={(e) => this.handleChange(e)}
              />
            </div>
          </div>

          <div className="form-group row">
            <div className="col-md-2">
              <p>Material needed:</p>
            </div>
            <div className="col-md-3">
              <input className="form-control"
              id="materialNeeded"
              value={this.state.materialMeeded}
              onChange={e => this.handleChange(e)}/>
            </div>
          </div>

          <div className="form-group row">
            <div className="col-md-2">
              <p>testing time, days:</p>
            </div>
            <div className="col-md-3">
              <input
              className="form-control"
              type="number"
              id="testingTime"
              value={this.state.testingTime}
              onChange={e => this.handleChange(e)}/>
            </div>
          </div>

          <div className="form-group row">
            <div className="col-md-2">
              <p>to be sent on:</p>
            </div>
            <div className="col-md-3">
              <input className="form-control"
              type="date"
              id="sent_on"
              value={this.state.sentOn}
              onChange={e => this.handleChange(e)}/>
            </div>
          </div>

          <div className="form-group row">
            <div className="col-md-2">
              <p>to be received on:</p>
            </div>
            <div className="col-md-3">
              <input className="form-control"
              type="date"
              id="receivedOn"
              value={this.state.receivedOn}
              onChange={e => this.handleChange(e)}/>
            </div>
          </div>

          <div className="form-group row">
            <div className="col-md-2">
              <p>tests to be started on:</p>
            </div>
            <div className="col-md-3">
              <input className="form-control"
              type="date"
              id="startedOn"
              value={this.state.startedOn}
              onChange={e => this.handleChange(e)}/>
            </div>
          </div>

          <div className="form-group row">
            <div className="col-md-2">
              <p>tests to be finished on:</p>
            </div>
            <div className="col-md-3">
              <input className="form-control"
                type="date"
                id="finishedOn"
                value={this.state.finishedOn}
                onChange={e => this.handleChange(e)}/>
            </div>
          </div>

          <div className="form-group row">
            <div className="col-md-2">
              <p>results to be received on:</p>
            </div>
            <div className="col-md-3">
              <input className="form-control"
              type="date"
              id="resultsReceived"
              value={this.state.resultsReceived}
              onChange={e => this.handleChange(e)}/>
            </div>
          </div>
          <div className="form-group row">
            <div className="row col-8 offset-2">
              <div className="col">
                <input
                type="submit"
                className="btn btn-primary btn-block"
                value="Save"
                />
              </div>
              <div className="col">
                <button className="btn btn-secondary btn-block">Reset</button>
              </div>
              <div className="col">
                <button
                  className="btn btn-danger btn-block"
                  onClick={(e) => this.handleCertUpdate(e)}
                >Update cert in B24
                </button>
              </div>
            </div>
          </div>
      </form>
        )
    }
}