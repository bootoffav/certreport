import React from 'react';
// import PDF from './PDF';
import PDFExport from './PDF/PDFExport';
import { IState } from '../../defaults';
import ExcelExport from './ExcelExport';

interface ExportProps {
  data: IState;
}

class Export extends React.Component<ExportProps> {

  export(e: any) {
    e.preventDefault();
    switch (e.currentTarget.dataset.type) {
      case 'pdf':
        // alert('not yet implemeted');
        new PDFExport(this.props.data).save();
        break;
      //   return new PDF(this.props.data).pdf.save(`${this.props.data.serialNumber} - ${this.props.data.applicantName}.pdf`);
      case 'xls':
        new ExcelExport(this.props.data).save();
        break;
    }
  }

  render() {
    return (
      <div id="toolbar" className="col-3 btn-group btn-group-toggle" data-toggle="buttons">
        <label
          className="btn btn-light btn-sm"
          data-type="pdf"
          onClick={this.export.bind(this)}
          ><input type="radio" />PDF</label>
        <label
          className="btn btn-light btn-sm"
          data-type="xls"
          onClick={this.export.bind(this)}
        ><input type="radio" />Excel</label>
      </div>
    );
  }
}

export default Export;