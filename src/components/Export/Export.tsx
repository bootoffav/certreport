import React from 'react';
import PDF from './PDF';
import { IState } from '../../defaults';
import ExcelExport from './ExcelExport';

interface ExportProps {
  type: string;
  data: IState;
}

class Export extends React.Component<ExportProps> {

  export() {
    switch (this.props.type) {
      // case 'pdf':
      //   return new PDF(this.props.data).pdf.save(`${this.props.data.serialNumber} - ${this.props.data.applicantName}.pdf`);
      default:
        return new ExcelExport(this.props.data).save();
    }
  }

  render() {
    return (
    <>
      <div className="col-2">
        <button className="btn btn-info btn-block"
          onClick={e => {
            e.preventDefault();
            this.export();
          }}
        >Application form</button>
      </div>
    </>);
  }
}

export default Export;