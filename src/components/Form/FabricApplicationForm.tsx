import React from 'react';
import './FabricApplicationForm.css';

class FabricApplicationForm extends React.Component {
  
  
  static checkBox: React.FunctionComponent<{
    label: string;
    table?: string;
    row?: number;
  }> = (props) => {

    const table = props.table || 'testRequirement';
    const row = props.row !== undefined ? props.row + '_' : '';
    const labelConverted = `${table}_${row}${props.label.replace(/ /g, "-")}`;

    return <div className="form-check form-check-inline">
      <input type="checkbox" className="form-check-input"
        id={labelConverted} name={labelConverted}
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
            />
          </td>
          <td><FabricApplicationForm.checkBox label={'A1'}/></td>
          <td><FabricApplicationForm.checkBox label={'A2'}/></td>
          <td colSpan={5}></td>
        </tr>
        <tr>
          <td><FabricApplicationForm.checkBox label={'EN 11612'}/></td>
          <td><FabricApplicationForm.checkBox row={2} label={'A1'}/></td>
          <td><FabricApplicationForm.checkBox row={2} label={'A2'}/></td>
          <td><FabricApplicationForm.checkBox label={'B'}/></td>
          <td><FabricApplicationForm.checkBox label={'C'}/></td>
          <td><FabricApplicationForm.checkBox label={'D'}/></td>
          <td><FabricApplicationForm.checkBox label={'E'}/></td>
          <td><FabricApplicationForm.checkBox label={'F'}/></td>
        </tr>
        <tr>
          <td><FabricApplicationForm.checkBox label={'EN 1149-5'}/></td>
          <td colSpan={2}><FabricApplicationForm.checkBox label={'EN 1149-1'}/></td>
          <td colSpan={2}><FabricApplicationForm.checkBox label={'EN 1149-3'}/></td>
          <td colSpan={3}></td>
        </tr>
        <tr>
          <td><FabricApplicationForm.checkBox label={'EN 61482-1-2'}/></td>
          <td colSpan={2}><FabricApplicationForm.checkBox label={'Class 1'}/></td>
          <td colSpan={2}><FabricApplicationForm.checkBox label={'Class 2'}/></td>
          <td colSpan={3}></td>
        </tr>
        <tr>
          <td><FabricApplicationForm.checkBox label={'EN 20471'}/></td>
          <td colSpan={7}>According to Standard Mandotory Test Requirement</td>
        </tr>
        <tr>
          <td><FabricApplicationForm.checkBox label={'EN 14116'}/></td>
          <td colSpan={7}>According to Standard Mandotory Test Requirement</td>
        </tr>
        <tr>
          <td><FabricApplicationForm.checkBox label={'EN 343'}/></td>
          <td colSpan={7}>According to Standard Mandotory Test Requirement</td>
        </tr>
        <tr>
          <td><FabricApplicationForm.checkBox label={'Other Standard 1'}/></td>
          <td colSpan={7}>According to Standard Mandotory Test Requirement</td>
        </tr>
        <tr>
          <td><FabricApplicationForm.checkBox label={'Other Standard 2'}/></td>
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
          <td>Wash Temperature</td>
          <td colSpan={6}>Dry Method</td>
        </tr>
        <tr>
          <td>Domestic Wash(ISO 6330)</td>
          <td></td>
          <td></td>
          <td><FabricApplicationForm.checkBox table={'washPreTreatment'} label={'A'}/></td>
          <td><FabricApplicationForm.checkBox table={'washPreTreatment'} label={'B'}/></td>
          <td><FabricApplicationForm.checkBox table={'washPreTreatment'} label={'C'}/></td>
          <td><FabricApplicationForm.checkBox table={'washPreTreatment'} label={'D'}/></td>
          <td><FabricApplicationForm.checkBox table={'washPreTreatment'} label={'E'}/></td>
          <td><FabricApplicationForm.checkBox table={'washPreTreatment'} label={'F'}/></td>
        </tr>
        <tr>
          <td>Industrial Wash(ISO 15797)</td>
          <td></td>
          <td>According to standard</td>
          <td colSpan={3}><FabricApplicationForm.checkBox table={'washPreTreatment'} label={'Tumble Dry'}/></td>
          <td colSpan={3}><FabricApplicationForm.checkBox table={'washPreTreatment'} label={'Tunnel Dry'}/></td>
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
              label='EUR' />
            /&nbsp;&nbsp;&nbsp;
            <FabricApplicationForm.checkBox
              table='footer'
              label='USD' />
            /&nbsp;&nbsp;&nbsp;
            <FabricApplicationForm.checkBox
              table={'footer'}
              label={'RMB'} />
          </td>
        </tr>
        <tr>
          <td>Test Certificate:</td>
          <td><FabricApplicationForm.checkBox table="footer" label='NO' />/   <FabricApplicationForm.checkBox table='footer' label='Required'/></td>
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