import React from 'react';
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
        new PDFExport(this.props.data).save();
        break;
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