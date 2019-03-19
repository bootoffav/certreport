import React from 'react';
import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import fileSaver from "file-saverjs";
import PDFExport from './PDFExport';
import ExcelExport from './ExcelExport';


class Export extends React.Component {

  export() {
    switch (this.props.type) {
      case 'pdf':
        return new PDFExport(this.props.data).save(`${this.props.data.serialNumber} - ${this.props.data.applicantName}.pdf`);
        // return generatePDF(this.props.data);
      case 'xls':
        return new ExcelExport(this.props.data);
        // return generateExcel(this.props.data);//.save(`${this.props.data.serialNumber} - ${this.props.data.applicantName}.pdf`);
      default:
        break;
    }
  }
  render() {
    return (
    <>
      <div className="col">
        <button className="btn btn-info btn-block"
          onClick={e => {
            e.preventDefault();
            this.export();
          }}
        >Get .{this.props.type}</button>
      </div>
    </>);
  }
}

export default Export;