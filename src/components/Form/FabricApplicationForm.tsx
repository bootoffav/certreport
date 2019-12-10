import React from 'react';
import { without } from 'lodash';

import './FabricApplicationForm.css';

class FabricApplicationForm extends React.Component<{
  state: any;
  updateParent: (DBState: any) => void;
}, {
  [key: string]: any;
  }> {

  toggleCheckboxState = (table: string, row: number, label: string) => {
    const { [table]: replacer } = this.props.state;

    replacer.splice(
      row,
      1,
      replacer[row].includes(label)
        ? without(replacer[row], label)
        : [...replacer[row], label]
    )

    this.props.updateParent({
      ...this.props.state,
      [table]: replacer
    });
  }

  static checkBox: React.FunctionComponent<{
    label: string;
    table?: string;
    row?: number;
    checked?: boolean;
    onChange?: (table: string, row: number, label: string) => void;
  }> = (props) => {

    const table = props.table || 'testRequirement';
    const row = props.row !== undefined ? props.row + '_' : '';
    const labelConverted = `${table}_${row}${props.label.replace(/ /g, "-")}`;

    return <div className="form-check form-check-inline">
      <input type="checkbox" className="form-check-input" checked={props.checked}
        // @ts-ignore
        id={labelConverted} name={labelConverted} onChange={props.onChange}
      />
      <label
        className="form-check-label"
        htmlFor={labelConverted}>
        {props.label}
      </label>
    </div>;
  };
  
  TestRequirement = () =>
    <table id="testRequirement" className="table table-sm table-bordered">
      <thead className="text-center">
        <tr>
          <th colSpan={8}>Test Requirement</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Standard No.</td>
          <td colSpan={7}>Optional Test Item Under Standard</td>
        </tr>
        <tr>
          {
            ['EN 11611', 'A1', 'A2'].map(item =>
              <td key={item}>
                <FabricApplicationForm.checkBox
                  label={item}
                  checked={this.props.state.testRequirement[0].includes(item)}
                  onChange={() => this.toggleCheckboxState('testRequirement', 0, item)}
                />
            </td>)
          }
          <td colSpan={5}></td>
        </tr>
        <tr>
          {['EN 11612', 'A1', 'A2', 'B', 'C', 'D', 'E', 'F'].map(item =>
            <td key={item}>
              <FabricApplicationForm.checkBox
                label={item}
                checked={this.props.state.testRequirement[1].includes(item)}
                onChange={() => this.toggleCheckboxState('testRequirement', 1, item)}
              />
            </td>)
          }
        </tr>
        <tr>
          {['EN 1149-5', 'EN 1149-1', 'EN 1149-3'].map(item =>
            <td key={item}>
              <FabricApplicationForm.checkBox
                label={item}
                checked={this.props.state.testRequirement[2].includes(item)}
                onChange={() => this.toggleCheckboxState('testRequirement', 2, item)}
              />
            </td>)
          }
          <td colSpan={5}></td>
        </tr>
        <tr>
          {['EN 61482-1-2', 'Class 1', 'Class 2'].map(item =>
            <td key={item}>
              <FabricApplicationForm.checkBox
                label={item}
                checked={this.props.state.testRequirement[3].includes(item)}
                onChange={() => this.toggleCheckboxState('testRequirement', 3, item)}
              />
            </td>)
          }
          <td colSpan={5}></td>
        </tr>
        <tr>
          <td>
            <FabricApplicationForm.checkBox label={'EN 20471'}
              checked={this.props.state.testRequirement[4].includes('EN 20471')}
              onChange={() => this.toggleCheckboxState('testRequirement', 4, 'EN 20471')}
            />
          </td>
          <td colSpan={7}>According to Standard Mandotory Test Requirement</td>
        </tr>
        <tr>
          <td>
            <FabricApplicationForm.checkBox label={'EN 14116'}
              checked={this.props.state.testRequirement[5].includes('EN 11416')}
              onChange={() => this.toggleCheckboxState('testRequirement', 5, 'EN 11416')}
            />
          </td>
          <td colSpan={7}>According to Standard Mandotory Test Requirement</td>
        </tr>
        <tr>
          <td>
            <FabricApplicationForm.checkBox label={'EN 343'}
              checked={this.props.state.testRequirement[6].includes('EN 343')}
              onChange={() => this.toggleCheckboxState('testRequirement', 6, 'EN 343')}
          />
          </td>
          <td colSpan={7}>According to Standard Mandotory Test Requirement</td>
        </tr>
        <tr>
          <td>
            <div className="custom-control custom-switch">
              &nbsp;&nbsp;&nbsp;<input type="checkbox" className="custom-control-input" id="testRequirement_Other-Standard-1"
              checked={this.props.state.testRequirement[7].includes('Other Standard 1')}
              onChange={() => this.toggleCheckboxState('testRequirement', 7, 'Other Standard 1')}
              />
              <label className="custom-control-label" htmlFor="testRequirement_Other-Standard-1">Other Standard 1</label>
            </div>
          </td>
          <td colSpan={7}>
            <input className="form-control form-control-sm input-xs"
              id='testRequirement_Other-Standard-1-description'
              value={this.props.state.otherStandard1}
              onChange={
                ({ currentTarget: { value } }) => 
                  this.props.updateParent({
                    ...this.props.state,
                    otherStandard1: value
                  })
              }
              disabled={!this.props.state.testRequirement[7].includes('Other Standard 1')}
            />
          </td>
        </tr>
        <tr>
          <td>
            <div className="custom-control custom-switch">
              &nbsp;&nbsp;&nbsp;<input type="checkbox" className="custom-control-input" id="testRequirement_Other-Standard-2"
              checked={this.props.state.testRequirement[8].includes('Other Standard 2')}
              onChange={() => this.toggleCheckboxState('testRequirement', 8, 'Other Standard 2')}
              />
              <label className="custom-control-label" htmlFor="testRequirement_Other-Standard-2">Other Standard 2</label>
            </div>
          </td>
          <td colSpan={7}>
            <input className="form-control form-control-sm input-xs"
              id='testRequirement_Other-Standard-2-description'
              value={this.props.state.otherStandard2}
              onChange={
                ({ currentTarget: { value } }) => 
                  this.props.updateParent({
                    ...this.props.state,
                    otherStandard2: value
                  })
              }
              disabled={!this.props.state.testRequirement[8].includes('Other Standard 2')}
            />
          </td>
        </tr>
      </tbody>
    </table>
  
  WashPreTreatmentRequirement = () => 
    <table id="washPreTreatment" className="table table-sm table-bordered">
      <thead className="text-center">
        <tr>
          <th colSpan={9}>Wash Pre-treatment Requirement - Please mark down below for your wash requirement</th>
        </tr>
      </thead>
      <tbody>
        <tr className="text-center">
          <td>Wash Method</td>
          <td>Cycles</td>
          <td>Wash Temperature &#8451;</td>
          <td colSpan={6}>Dry Method</td>
        </tr>
        <tr>
          <td>Domestic Wash(ISO 6330)</td>
          <td>
            <input type="number"
              className="form-control form-control-sm input-xs"
              id="washPreTreatment_0_cycles"
              value={this.props.state.cycles[0]}
              onChange={
                ({ currentTarget: { value } }) =>
                  this.props.updateParent({
                    ...this.props.state,
                    cycles: [value, this.props.state.cycles[1]]
                  })
              }/>
          </td>
          <td>
            <input type="number"
              className="form-control form-control-sm input-xs"
              id="washPreTreatment_0_temperature"
              value={this.props.state.washTemp}
              onChange={
                ({ currentTarget: { value } }) =>
                  this.props.updateParent({ ...this.props.state, washTemp: value })
              }
            />
          </td>

          {['A', 'B', 'C', 'D', 'E', 'F'].map(item =>
            <td key={item}>
              <FabricApplicationForm.checkBox
                table={'washPreTreatment'}
                label={item}
                checked={this.props.state.washPreTreatment[0].includes(item)}
                onChange={() => this.toggleCheckboxState('washPreTreatment', 0, item)}
              />
            </td>
          )}
        </tr>
        <tr>
          <td>Industrial Wash(ISO 15797)</td>
          <td>
            <input type="number"
              className="form-control form-control-sm input-xs"
              id="washPreTreatment_1_cycles"
              value={this.props.state.cycles[1]}
              onChange={({ currentTarget: { value } }) =>
                this.props.updateParent({
                  ...this.props.state,
                  cycles: [this.props.state.cycles[0], value]
                })}
            
            />
          </td>
          <td>According to standard</td>
          {['Tumble Dry', 'Tunnel Dry'].map(item =>
            <td colSpan={3} key={item}>
              <FabricApplicationForm.checkBox
                table={'washPreTreatment'}
                label={item}
                checked={this.props.state.washPreTreatment[1].includes(item)}
                onChange={() => this.toggleCheckboxState('washPreTreatment', 1, item)}
              />
            </td>
          )}
        </tr>
      </tbody>
    </table>

  formFooter: React.FunctionComponent = () => {
    const row1 = ['EUR', 'USD', 'RMB'];
    const row2 = ['NO', 'Required'];

    return <table id="footer" className="table table-sm table-borderless">
      <tbody>
        <tr>
          <td>PI/OFFER in:</td>
          <td>
            {row1.map(currency => 
              <FabricApplicationForm.checkBox
                key={currency}
                table='footer'
                label={currency}
                checked={this.props.state.footer[0].includes(currency)}
                onChange={() => this.toggleCheckboxState('footer', 0, currency)}
              >/&nbsp;&nbsp;&nbsp;</FabricApplicationForm.checkBox>
            )}
          </td>
        </tr>

        <tr>
          <td>Test Certificate:</td>
          <td>
            {row2.map(item =>
              <FabricApplicationForm.checkBox
                key={item}
                table='footer'
                label={item}
                checked={this.props.state.footer[1].includes(item)}
                onChange={() => this.toggleCheckboxState('footer', 1, item)}
              >/</FabricApplicationForm.checkBox>
            )}
          </td>
        </tr>
      </tbody>
    </table>
  }

  render() {
    return <>
      <this.TestRequirement />
      <this.WashPreTreatmentRequirement />
      <this.formFooter />
    </>;
  }
}

export default FabricApplicationForm;
