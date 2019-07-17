import React from 'react';
import _ from 'lodash';
import faunadb, { query as q } from "faunadb";

import './FabricApplicationForm.css';


class FabricApplicationForm extends React.Component<{
  state: string;
  taskId: string;
  updateParent: (state: string) => void;
}, {
  [key: string]: any;
}> {
  DBClient: any;

  constructor(props: any) {
    super(props);
    if (typeof process.env.REACT_APP_FAUNADB_KEY !== 'string') {
      throw new Error('Problem with db key');
    }

    this.DBClient = new faunadb.Client({
      secret: process.env.REACT_APP_FAUNADB_KEY
    });
    var [
      testRequirement = '',
      washPreTreatment = '',
      footer = ''
    ] = props.state.split(' ');

    this.state = {
      testRequirement: testRequirement.split(';')
        .map((row: string) => row.split(',')).slice(0, -1),
      washPreTreatment: washPreTreatment.split(';')
        .map((row: string) => row.split(',')).slice(0, -1),
      footer: footer.split(';')
        .map((row: string) => row.split(',')).slice(0, -1),
      cycles: [5, ''],
      washTemp: 60,
      otherStandard1: 'According to Standard Mandotory Test Requirement'
    }

    this.getDataFromDB();
  }

  getDataFromDB() {
    this.DBClient.query(q.Get(q.Match(q.Index('id'), +this.props.taskId)))
      .then((res: any) => {
        this.setState({
          // @ts-ignore
          cycles: res.data.cycles, washTemp: res.data.washTemp, otherStandard1: res.data.otherStandard1, ref: res.ref.value.id
        });
      })
      .catch((res: any) => {
        this.DBClient.query(
          q.Create(q.Class('aitexForm'),
            {
              data: {
                id: +this.props.taskId,
                cycles: [5, ''],
                washTemp: 60,
                otherStandard1: 'According to Standard Mandotory Test Requirement'
              }
            })).then((res: any) => this.setState({
              ref: res.ref.value.id
            }))
      });
  }

  saveToDB() {
    this.DBClient.query(q.Update(q.Ref(q.Class("aitexForm"), this.state.ref),
      {
        data:
        {
          cycles: this.state.cycles,
          washTemp: this.state.washTemp,
          otherStandard1: this.state.otherStandard1
        }
      }
    ));
  }

  tables = ['testRequirement', 'washPreTreatment', 'footer'];

  getCheckboxState = (table: string, row: number, label: string): boolean => this.state[table][row].includes(label);

  propagateUpdate = () => {
    let flattenState = '';
    this.tables.forEach(table => {
      this.state[table].forEach((row: string[]) => {
        flattenState += row.join(',') + ';';
      });
      flattenState += ' ';
    });
    this.props.updateParent(flattenState.trim());
  };

  toggleCheckboxState = (table: string, row: number, label: string) => {
    if (this.state[table][row].includes(label)) {
      //удаляем
      this.setState((state: any, props) => {
        const replacer = [...state[table]];
        replacer.splice(row, 1, _.without(state[table][row], label));
        return { [table]: replacer };
      }, this.propagateUpdate);
      } else {
      // добавляем
      this.setState((state: any) => {
        const replacer = [...state[table]];
        replacer.splice(row, 1, [...state[table][row], label]);
        return { [table]: replacer };
      }, this.propagateUpdate);
    }

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
          <td>
            <FabricApplicationForm.checkBox
              label={'EN 11611'}
              checked={this.getCheckboxState('testRequirement', 0, 'EN-11611')}
              onChange={() => this.toggleCheckboxState('testRequirement', 0, 'EN-11611')}
            />
          </td>
          <td>
            <FabricApplicationForm.checkBox
              label={'A1'}
              checked={this.getCheckboxState('testRequirement', 0, 'A1')}
              onChange={() => this.toggleCheckboxState('testRequirement', 0, 'A1')}
            />
          </td>
          <td>
            <FabricApplicationForm.checkBox label={'A2'}
              checked={this.getCheckboxState('testRequirement', 0, 'A2')}
              onChange={() => this.toggleCheckboxState('testRequirement', 0, 'A2')}
            />
          </td>
          <td colSpan={5}></td>
        </tr>
        <tr>
          <td>
            <FabricApplicationForm.checkBox label={'EN 11612'}
              checked={this.getCheckboxState('testRequirement', 0, 'EN-11612')}
              onChange={() => this.toggleCheckboxState('testRequirement', 0, 'EN-11612')}
            />
          </td>
          <td>
            <FabricApplicationForm.checkBox row={2} label={'A1'}
              checked={this.getCheckboxState('testRequirement', 1, 'A1')}
              onChange={() => this.toggleCheckboxState('testRequirement', 1, 'A1')}
            />
          </td>
          <td>
            <FabricApplicationForm.checkBox row={2} label={'A2'}
              checked={this.getCheckboxState('testRequirement', 1, 'A2')}
              onChange={() => this.toggleCheckboxState('testRequirement', 1, 'A2')}
            />
          </td>
          <td>
            <FabricApplicationForm.checkBox label={'B'}
              checked={this.getCheckboxState('testRequirement', 1, 'B')}
              onChange={() => this.toggleCheckboxState('testRequirement', 1, 'B')}
            />
          </td>
          <td>
            <FabricApplicationForm.checkBox label={'C'}
              checked={this.getCheckboxState('testRequirement', 1, 'C')}
              onChange={() => this.toggleCheckboxState('testRequirement', 1, 'C')}
            />
          </td>
          <td>
            <FabricApplicationForm.checkBox label={'D'}
              checked={this.getCheckboxState('testRequirement', 1, 'D')}
              onChange={() => this.toggleCheckboxState('testRequirement', 1, 'D')}
            />
          </td>
          <td>
            <FabricApplicationForm.checkBox label={'E'}
              checked={this.getCheckboxState('testRequirement', 1, 'E')}
              onChange={() => this.toggleCheckboxState('testRequirement', 1, 'E')}
            />
          </td>
          <td>
            <FabricApplicationForm.checkBox label={'F'}
              checked={this.getCheckboxState('testRequirement', 1, 'F')}
              onChange={() => this.toggleCheckboxState('testRequirement', 1, 'F')}
            />
          </td>
        </tr>
        <tr>
          <td>
            <FabricApplicationForm.checkBox label={'EN 1149-5'}
              checked={this.getCheckboxState('testRequirement', 2, 'EN-1149-5')}
              onChange={() => this.toggleCheckboxState('testRequirement', 2, 'EN-1149-5')}
            />
          </td>
          <td colSpan={2}>
            <FabricApplicationForm.checkBox label={'EN 1149-1'}
              checked={this.getCheckboxState('testRequirement', 2, 'EN1149-1')}
              onChange={() => this.toggleCheckboxState('testRequirement', 2, 'EN1149-1')}
            />
          </td>
          <td colSpan={2}>
            <FabricApplicationForm.checkBox label={'EN 1149-3'}
              checked={this.getCheckboxState('testRequirement', 2, 'EN-1149-3')}
              onChange={() => this.toggleCheckboxState('testRequirement', 2, 'EN-1149-3')}
            />
          </td>
          <td colSpan={3}></td>
        </tr>
        <tr>
          <td>
            <FabricApplicationForm.checkBox label={'EN 61482-1-2'}
              checked={this.getCheckboxState('testRequirement', 3, 'EN 61482-1-2')}
              onChange={() => this.toggleCheckboxState('testRequirement', 3, 'EN 61482-1-2')}
            />
          </td>
          <td colSpan={2}>
            <FabricApplicationForm.checkBox label={'Class 1'}
              checked={this.getCheckboxState('testRequirement', 3, 'Class-1')}
              onChange={() => this.toggleCheckboxState('testRequirement', 3, 'Class-1')}
            />
          </td>
          <td colSpan={2}>
            <FabricApplicationForm.checkBox label={'Class 2'}
              checked={this.getCheckboxState('testRequirement', 3, 'Class-2')}
              onChange={() => this.toggleCheckboxState('testRequirement', 3, 'Class-2')}
            />
          </td>
          <td colSpan={3}></td>
        </tr>
        <tr>
          <td>
            <FabricApplicationForm.checkBox label={'EN 20471'}
              checked={this.getCheckboxState('testRequirement', 4, 'EN-20471')}
              onChange={() => this.toggleCheckboxState('testRequirement', 4, 'EN-20471')}
            />
          </td>
          <td colSpan={7}>According to Standard Mandotory Test Requirement</td>
        </tr>
        <tr>
          <td>
            <FabricApplicationForm.checkBox label={'EN 14116'}
              checked={this.getCheckboxState('testRequirement', 5, 'EN-14116')}
              onChange={() => this.toggleCheckboxState('testRequirement', 5, 'EN-14116')}
            />
          </td>
          <td colSpan={7}>According to Standard Mandotory Test Requirement</td>
        </tr>
        <tr>
          <td>
            <FabricApplicationForm.checkBox label={'EN 343'}
              checked={this.getCheckboxState('testRequirement', 6, 'EN-343')}
              onChange={() => this.toggleCheckboxState('testRequirement', 6, 'EN-343')}
          />
          </td>
          <td colSpan={7}>According to Standard Mandotory Test Requirement</td>
        </tr>
        <tr>
          <td>
            <div className="custom-control custom-switch">
              <input type="checkbox" className="custom-control-input" id="testRequirement_Other-Standard-1"
                checked={this.getCheckboxState('testRequirement', 7, 'Other-Standard-1')}
                onChange={() => this.toggleCheckboxState('testRequirement', 7, 'Other-Standard-1')}
              />
              <label className="custom-control-label" htmlFor="testRequirement_Other-Standard-1">Other Standard 1</label>
            </div>
          </td>
          <td colSpan={7}>
            <input className="form-control form-control-sm input-xs"
              id='testRequirement_Other-Standard-1-description'
              value={this.state.otherStandard1}
              onChange={({ currentTarget }) => {
                this.setState({
                  otherStandard1: currentTarget.value
                });
              }}
              disabled={!this.getCheckboxState('testRequirement', 7, 'Other-Standard-1')}
            />
          </td>
        </tr>
        <tr>
          <td>
            <FabricApplicationForm.checkBox label={'Other Standard 2'}
              checked={this.getCheckboxState('testRequirement', 8, 'Other-Standard-2')}
              onChange={() => this.toggleCheckboxState('testRequirement', 8, 'Other-Standard-2')}
            />
          </td>
          <td colSpan={7}>According to Standard Mandotory Test Requirement</td>
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
              value={this.state.cycles[0]}
              onChange={({ currentTarget }) => {
                this.setState({ cycles: [currentTarget.value, this.state.cycles[1]] });
              }}
            />
          </td>
          <td>
            <input type="number"
              className="form-control form-control-sm input-xs"
              id="washPreTreatment_0_temperature"
              value={this.state.washTemp}
              onChange={({ currentTarget }) => {
                this.setState({
                  washTemp: currentTarget.value
                });
              }}
            />
          </td>
          <td>
            <FabricApplicationForm.checkBox
              table={'washPreTreatment'}
              label={'A'}
              checked={this.getCheckboxState('washPreTreatment', 0, 'A')}
              onChange={() => this.toggleCheckboxState('washPreTreatment', 0, 'A')}
            />
          </td>
          <td>
            <FabricApplicationForm.checkBox
              table={'washPreTreatment'}
              label={'B'}
              checked={this.getCheckboxState('washPreTreatment', 0, 'B')}
              onChange={() => this.toggleCheckboxState('washPreTreatment', 0, 'B')}
            />
          </td>
          <td>
            <FabricApplicationForm.checkBox
              table={'washPreTreatment'}
              label={'C'}
              checked={this.getCheckboxState('washPreTreatment', 0, 'C')}
              onChange={() => this.toggleCheckboxState('washPreTreatment', 0, 'C')}
            />
          </td>
          <td>
            <FabricApplicationForm.checkBox
              table={'washPreTreatment'}
              label={'D'}
              checked={this.getCheckboxState('washPreTreatment', 0, 'D')}
              onChange={() => this.toggleCheckboxState('washPreTreatment', 0, 'D')}
            />
          </td>
          <td>
            <FabricApplicationForm.checkBox
              table={'washPreTreatment'}
              label={'E'}
              checked={this.getCheckboxState('washPreTreatment', 0, 'E')}
              onChange={() => this.toggleCheckboxState('washPreTreatment', 0, 'E')}
            />
          </td>
          <td>
            <FabricApplicationForm.checkBox
              table={'washPreTreatment'}
              label={'F'}
              checked={this.getCheckboxState('washPreTreatment', 0, 'F')}
              onChange={() => this.toggleCheckboxState('washPreTreatment', 0, 'F')}
            />
          </td>
        </tr>
        <tr>
          <td>Industrial Wash(ISO 15797)</td>
          <td>
            <input type="number"
              className="form-control form-control-sm input-xs"
              id="washPreTreatment_1_cycles"
              value={this.state.cycles[1]}
              onChange={({ currentTarget }) => {
                this.setState({ cycles: [this.state.cycles[0], currentTarget.value] });
              }}
            />
          </td>
          <td>According to standard</td>
          <td colSpan={3}>
            <FabricApplicationForm.checkBox
              table={'washPreTreatment'}
              label={'Tumble Dry'}
              checked={this.getCheckboxState('washPreTreatment', 1, 'Tumble-Dry')}
              onChange={() => this.toggleCheckboxState('washPreTreatment', 1, 'Tumble-Dry')}
            />
          </td>
          <td colSpan={3}>
            <FabricApplicationForm.checkBox
              table={'washPreTreatment'}
              label={'Tunnel Dry'}
              checked={this.getCheckboxState('washPreTreatment', 1, 'Tunnel-Dry')}
              onChange={() => this.toggleCheckboxState('washPreTreatment', 1, 'Tunnel-Dry')}
            />
          </td>
        </tr>
      </tbody>
    </table>

  formFooter: React.FunctionComponent = () =>
    <table id="footer" className="table table-sm table-borderless">
      <tbody>
        <tr>
          <td>PI/OFFER in:</td>
          <td>
            <FabricApplicationForm.checkBox
              table='footer'
              label='EUR'
              checked={this.getCheckboxState('footer', 0, 'EUR')}
              onChange={() => this.toggleCheckboxState('footer', 0, 'EUR')}
            />
            /&nbsp;&nbsp;&nbsp;
            <FabricApplicationForm.checkBox
              table='footer'
              label='USD'
              checked={this.getCheckboxState('footer', 0, 'USD')}
              onChange={() => this.toggleCheckboxState('footer', 0, 'USD')}
            />
            /&nbsp;&nbsp;&nbsp;
            <FabricApplicationForm.checkBox
              table={'footer'}
              label={'RMB'}
              checked={this.getCheckboxState('footer', 0, 'RMB')}
              onChange={() => this.toggleCheckboxState('footer', 0, 'RMB')}
            />
          </td>
          <td rowSpan={2}>
            <button
              className="float-right btn btn-info btn-sm"
              onClick={(e) => {
                e.preventDefault();
                this.saveToDB();
              }}>save table data</button>
          </td>
        </tr>
        <tr>
          <td>Test Certificate:</td>
          <td>
            <FabricApplicationForm.checkBox
              table="footer"
              label='NO'
              checked={this.getCheckboxState('footer', 1, 'NO')}
              onChange={() => this.toggleCheckboxState('footer', 1, 'NO')}
              />/   <FabricApplicationForm.checkBox
              table='footer'
              label='Required'
              checked={this.getCheckboxState('footer', 1, 'Required')}
              onChange={() => this.toggleCheckboxState('footer', 1, 'Required')}
            />
          </td>
        </tr>
      </tbody>
    </table>
  render() {
    return <section id='FabricApplicationForm'>
      <this.TestRequirement />
      <this.WashPreTreatmentRequirement />
      <this.formFooter />
      </section>;
     }
   }
   
export default FabricApplicationForm;