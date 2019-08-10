import React from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import { vfs } from './vfs_fonts.js';

import { tableLayout, fonts } from './settings';

class TaskNamesExport extends React.Component<{
  tasks: any;
}> {

  generateContent() {
    let i = 1;
    return this.props.tasks.map((task: any) => {
      task.TITLE = task.TITLE.replace('€', 'EURO');
      return {
        text: [
          { text: `${i++}.`, bold: true },
          ` ${task.TITLE} `,
        ],
        margin: [3, 3]
      }
    });
  }

  export() {
    let docDefinition = {
      content: this.generateContent(),
      defaultStyle: {
        fontSize: 11,
        font: 'TimesNewRoman',
      },
      pageOrientation: 'landscape',
    };
    return pdfMake.createPdf(
      // @ts-ignore
      docDefinition, tableLayout, fonts, vfs
      ).download(`Task titles (certreport.xmtextiles.com).pdf`);
  }

  render() {
    return <button
      className="btn btn-sm btn-outline-success"
      onClick={this.export.bind(this)}
    >PDF of task names</button>
  }
}

export default TaskNamesExport;