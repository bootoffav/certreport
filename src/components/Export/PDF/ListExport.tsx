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

  generateTableStructureForResults = () => ({
    accessors: [
      'state.serialNumber', 'state.brand', 'state.stage', 'lastActionDate',
      'TITLE', 'state.article', 'state.testReport',
      'state.certificate', 'state.standardsResult'
    ],
    headers: [
      '#', '##', 'Brand', 'Status', 'L. A. D.', 'Task title',
      'Fabric', 'Test report', 'Certificate', 'Result'
    ].map(this.boldText),
    widths: [20, 40, 50, 60, 70, '*', 100, 100, 200, 100]
  });

  generateContent() {
    if (this.props.stage === 'results') {
      var { accessors, headers, widths } = this.generateTableStructureForResults();
    } else {
      accessors = this.props.columns.map((col: any) => {
        return typeof col.accessor != 'function'
          ? col.accessor
          : `state.${col.id}`
      });

      headers = this.props.columns.map(({ Header }: any) => this.boldText(Header))
      widths = this.props.columns.map(({ accessor, minWidth, width }: any) =>
      accessor === 'TITLE' ? 'auto' : minWidth || width || '*'
      );
    }

    return [
      { text: this.stage, fontSize: 30, alignment: 'center', margin: [5, 4] },
      {
        table: {
          widths,
          body: [
            headers,
            ...this.genRow(this.props.tasks, accessors)
          ]
        }
      }
    ];
  }

  boldText = (text: string) => ({
    text,
    fontSize: 16,
    alignment: 'center',
    bold: true
  });

  // crap code to refactor ASAP
  * genRow(tasks: any, accessors: any) {
    for (let i = 0; i < tasks.length; i++) {
      const row: any[] = [i + 1];

      accessors.forEach((acc: string) => {
        switch (acc) {
          case 'TITLE':
            row.push({
              text: tasks[i][acc],
              decoration: 'underline',
              color: 'blue',
              link: `${process.env.REACT_APP_B24_HOST}/company/personal/user/${process.env.REACT_APP_B24_USER_ID}/tasks/task/view/${tasks[i].ID}/`
            });
          break;
          case 'state.article':
            row.push(this.boldText(tasks[i].state.article));
            break;
          case 'state.certificate':
            const files = tasks[i]['UF_TASK_WEBDAV_FILES'] || [];
            row.push(files.map((file: any) => ({
                text: `${file.NAME}`,
                decoration: 'underline',
                color: 'blue',
                link: `${process.env.REACT_APP_B24_HOST}${file.VIEW_URL}`,
            })));
            break;
          case 'state.standardsResult':
            const colorMap: {
              [key: string]: any;
            } = {
              'pass': 'green',
              'fail': 'red',
              undefined: 'black'
            };
            const results = [{
              text: 'Result: ' + (tasks[i].state.resume || 'none'),
              color: colorMap[tasks[i].state.resume]
            }];
            for (let [standard, result] of Object.entries(tasks[i].state.standardsResult)) {
              results.push({
                text: `${standard} - ${result}`,
                color: result === 'pass' ? 'green' : 'red'
              });
              // if (standard === 'EN 11612') {
              //   const passes = [];
              //   const fails = [];
              //   for (let [prop, val] of Object.entries(tasks[i].state.EN11612Detail)) {
              //     val === 'pass' ? passes.push(prop) : fails.push(prop);
              //   }
              //   results.push({ text: `PASS - (${passes})`, color: 'green' });
              //   results.push({ text: `PASS - (${fails})`, color: 'red' });
              // }
            }
            // debugger;
            row.push(results);
            break;
          default:
            acc.includes('state.') && !!tasks[i].state[acc.substring(6)]
              ? row.push(tasks[i].state[acc.substring(6)])
              : row.push(tasks[i][acc] || '')
        }
      });

      yield row;
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
        font: 'Arial',
      },
      pageOrientation: 'landscape',
      pageSize: 'A3'
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