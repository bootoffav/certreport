import React from 'react';
import './Standards.css';

type IEN11612Detail = {
  A1?: 'pass' | 'fail';
  A2?: 'pass' | 'fail';
  B?: 'pass' | 'fail';
  C?: 'pass' | 'fail';
  D?: 'pass' | 'fail';
  E?: 'pass' | 'fail';
  F?: 'pass' | 'fail';
}

class EN11612Detail extends React.Component<{
  updateParent: (state: IEN11612Detail) => void;
  state?: IEN11612Detail;
}>  {
  blocks = ['A1', 'A2', 'B', 'C', 'D', 'E', 'F'];
  state = {};

  UNSAFE_componentWillReceiveProps({ state: newState }: any) {
    newState.reset ?
    this.setState((s: any) => Object.keys(s).map(k => s[k] = null),
      () => this.props.updateParent(this.state))
    : this.setState({ ...newState });
  }

  onChange = ({ currentTarget }: any) => this.setState({
    [currentTarget.name]: currentTarget.dataset['result']
  }, () => this.props.updateParent(this.state));

  render() {
    return <div className="d-flex">
      {this.blocks.map(name => {
        return <div key={name} className="flex-fill d-flex flex-column">
          <p className="text-center">
            <span className="m-1">{name}</span>
          </p>
          <div className="d-flex justify-content-center">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name={name}
                data-result='fail'
                // @ts-ignore
                checked={this.state[name] === 'fail'}
                onChange={this.onChange}
              />
              <label className="form-check-label"><span className="oi oi-circle-x"></span></label>
            </div>&nbsp;&nbsp;&nbsp;
          <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name={name}
                data-result='pass'
                // @ts-ignore
                checked={this.state[name] === 'pass'}
                onChange={this.onChange}
              />
              <label className="form-check-label"><span className="oi oi-thumb-up"></span></label>
            </div>
          </div>
        </div>
      })}
    </div>
  }
}

type StandardsProps = {
  updateParent: (state: EN11612Detail) => void;
  standards: string;
  standardsResult: {
    [key: string]: string;
  }
  resultChange: (el: React.SyntheticEvent) => void;
  EN11612Detail?: any;
};

function Standards(props: StandardsProps) {
  if (props.standards === '') {
    return <div className="d-flex justify-content-center align-items-center h-100">
      <h5 className="text-uppercase">No standard chosen</h5>
    </div>;
    }
  
    const standards = props.standards.split(', ');
    
    /**
     * Return JSX element for standard in form of accordion
     * @param standard string represantation of Standard
     * @param i used as key for React
   * @returns {JSX}
   */
  function renderStandard(standard: string, i: any) {
    const EN11612 = standard === 'EN 11612' ? props.EN11612Detail : {};
    const id = standard.replace(/\s/g, '');
    return <div key={i}>
      <div className="card">
        <div className="card-header" id={`heading_${id}`}>
          <div className="d-flex">
            <button className="btn btn-link" onClick={(e) => e.preventDefault()} data-toggle="collapse" data-target={`#collapse_${id}`} aria-expanded="true" aria-controls={`collapse_${id}`}>
              {standard}
            </button>
            <div className="ml-auto form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                checked={props.standardsResult[standard] === 'fail'}
                onChange={props.resultChange}
                name={`radioOptions${id}`}
                data-standard={standard}
                id={`radioFail${id}`}
                value="fail"
                />
              <label className="form-check-label"><span className="oi oi-circle-x"></span></label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                checked={props.standardsResult[standard] === 'pass'}
                onChange={props.resultChange}
                name={`radioOptions${id}`}
                data-standard={standard}
                id={`radioPass${id}`}
                value="pass"
              />
              <label className="form-check-label"><span className="oi oi-thumb-up"></span></label>
            </div>
            <button type="button"
              className="btn btn-sm btn-link btn-reset"
              data-standard={standard}
              onClick={(e) => {
                props.resultChange(e);
                EN11612.reset = true;
              }}
            >Reset</button>
          </div>
        </div>
        <div id={`collapse_${id}`} className={standard === 'EN 11612' ? 'show' : 'collapse'} aria-labelledby={`heading_${id}`} data-parent="#accordionStandards">
          <div className="card-body">
            {standard === 'EN 11612' && <EN11612Detail state={EN11612}
              // @ts-ignore
              updateParent={props.updateParent} />}
          </div>
        </div>
      </div>
    </div>;
  }

  return <div className="accordion" id="accordionStandards">{standards.map(renderStandard)}</div>;
}

export default Standards;