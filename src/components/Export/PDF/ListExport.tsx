import React from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import m from 'moment';
import { vfs } from './vfs_fonts.js';
import { Stage } from '../../../Task/Task';

import { tableLayout, fonts } from './settings';

class ListExport extends React.Component<{
  tasks: any;
  columns: any;
  stage: any;
}> {
  stage: string | undefined;

  generateContent() {
    const tasks = this.props.tasks.map((task: any) => {
      task.TITLE = task.TITLE.replace('€', 'EURO');
      return task;
    });
    const accessors = this.props.columns.map((col: any) => {
      return typeof col.accessor != 'function'
        ? col.accessor
        : `state.${col.id}`
    });
    const headers = this.props.columns.map((col: any) => ({
      text: col.Header.replace('€', 'EURO'),
      fontSize: 16,
      alignment: 'center',
      bold: true
      })
    );
    const widths = this.props.columns.map(({ accessor, minWidth, width}: any) => 
      accessor === 'TITLE' ? 'auto' : minWidth || width || '*'
    );

    return [
      { text: this.stage, fontSize: 30, alignment: 'center', margin: [5, 4] },
      {
        table: {
          widths,
          body: [
            headers,
            ...this.genRow(tasks, accessors)
          ]
        }
      }
    ];
  }

  // crap code to refactor ASAP
  * genRow(tasks: any, accessors: any) {
    for (let i = 0; i < tasks.length; i++) {
      const yield_this: string[] = [];
      accessors.forEach((acc: any) => {
        acc.includes('state.') && !!tasks[i].state[acc.substring(6)]
         ? yield_this.push(tasks[i].state[acc.substring(6)])
         : yield_this.push(tasks[i][acc] || '')
      });
      yield yield_this;
    }
  }

  export = () => {
    switch (this.props.stage) {
      case 'overdue':
        this.stage = `Overdue Certifications in Testing Lab (on ${m().format('DD.MM.YYYY')})`;
        break;
      case 'results':
        this.stage = 'Results';
        break;
      default:
        this.stage = Stage[this.props.stage] || 'ALL';
    }

    let docDefinition = {
      content: this.generateContent(),
      defaultStyle: {
        fontSize: 14,
        font: 'TimesNewRoman',
      },
      pageOrientation: 'landscape',
      pageSize: 'A2'
    };
    return pdfMake.createPdf(
      // @ts-ignore
      docDefinition, tableLayout, fonts, vfs
      ).download(`${this.stage}.pdf`);
  }

  render() {
    return <button
      className="btn btn-sm btn-outline-success"
      onClick={this.export}
    >save to PDF</button>
  }
}

export default ListExport;