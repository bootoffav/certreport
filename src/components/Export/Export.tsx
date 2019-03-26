import React from 'react';
// import PDFExport from './PDFExport';
// import ExcelExport from './ExcelExport';

interface ExportProps {
  type: string;
  data: any;
}

class Export extends React.Component<ExportProps> {

  // export() {
  //   switch (this.props.type) {
  //     case 'pdf':
  //       return (new PDFExport(this.props.data)).pdf.save(`${this.props.data.serialNumber} - ${this.props.data.applicantName}.pdf`);
  //     default:
  //       break;
  //       // return new ExcelExport(this.props.data);
  //   }
  // }

  render() {
    return (
    <>
      <div className="col">
        <button className="btn btn-info btn-block"
          onClick={e => {
            e.preventDefault();
            // this.export();
          }}
        >Get .{this.props.type}</button>
      </div>
    </>);
  }
}

export default Export;