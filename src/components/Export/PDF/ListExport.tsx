import React from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import dayjs from 'dayjs';
import { vfs } from './vfs_fonts.js';
import { Stage } from '../../../Task/Task';

import { tableLayout, fonts } from './settings';

class ListExport extends React.Component<{
  tasks: any;
  columns: any;
  stage: any;
  startDate?: Date;
  endDate?: Date;
}> {
  totalPrice = 0;
  stage: string | undefined;

  generateTableStructureForResults = () => ({
    accessors: [
      'position', 'state.serialNumber', 'state.brand', 'state.stage', 'lastActionDate',
      'TITLE', 'state.article', 'state.testReport',
      'state.certificate', 'state.standardsResult', 'state.news'
    ],
    headers: [
      '#', '##', 'Brand', 'Status', 'L. A. D.', 'Task title',
      'Fabric', 'Test report', 'Certificate', 'Result', 'News'
    ].map(this.boldText),
    widths: [20, 40, 50, 60, 70, '*', 100, 100, 180, 100, 100]
  });

  generateContent() {
    if (this.props.stage === 'all') {
      var { accessors, headers, widths } = this.generateTableStructureForResults();
    } else {
      accessors = this.props.columns.map((col: any) => {
        return typeof col.accessor != 'function'
          ? col.accessor
          : `state.${col.id}`
      });

      headers = this.props.columns.map(({ Header }: any) => this.boldText(Header))
      widths = this.props.columns.map(({ accessor, minWidth, width }: any) => {
        switch (accessor) {
          case 'TITLE':
            return 'auto'
          case 'state.readyOn':
            return 70;
          case 'state.article':
            return 130;
          default:
            return minWidth || width || '*'
        }
      });
    }

    const table = {
      table: {
        widths,
        body: [
          headers,
          ...[...this.genRow(this.props.tasks, accessors)]
            // sort by increasing SerialNumber
            .sort((a: any, b: any) => {
              if (a[1] < b[1]) { return -1; }
              if (a[1] > b[1]) { return 1; }
              return 0;
            })
        ]
      }
    };
    for (let i = 0; i < table.table.body.length; i++) {
      if (i === 0) continue;
      table.table.body[i][0] = i;
    } // for column # make right count

    // add TotalPrice
    table.table.body.push([
      { text: '', colSpan: accessors.length - 1 }, // empty columns
      ...Array(accessors.length - 2).fill({ text: '', border: 'none'}), // required by pdkMake
      {
        alignment: 'right',
        text: `€${Math.round(this.totalPrice).toLocaleString().replace(/,/g, ' ')}`
      }
    ]);

    return [
      { text: this.stage, fontSize: 30, alignment: 'center', margin: [5, 4] },
      table
    ];
  }

  boldText = (text: string) => ({
    text,
    fontSize: 16,
    alignment: 'center',
    bold: true,
  });

  * genRow(tasks: any, accessors: any) {
    for (let i = 0; i < tasks.length; i++) {
      const row: any = [];

      accessors.forEach((acc: string) => {
        switch (acc) {
          case 'TITLE':
            row.push({
              text: tasks[i][acc],
              color: 'blue',
              link: `${process.env.REACT_APP_B24_HOST}/company/personal/user/${process.env.REACT_APP_B24_USER_ID}/tasks/task/view/${tasks[i].ID}/`
            });
          break;
          case 'state.article':
            row.push({
              ...this.boldText(tasks[i].state.article),
              alignment: 'left'
            });
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
            row.push(results);
            break;
          case 'state.price':
            this.totalPrice += Number(tasks[i].state.price);
            row.push({
              alignment: 'right',
              text: tasks[i].state.price === '' ? '' : `€${Math.round(tasks[i].state.price).toLocaleString().replace(/,/g, ' ')}`
            });
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
        this.stage = `Overdue Certifications in Testing Lab (on ${dayjs().format('DD.MM.YYYY')})`;
        break;
      case 'all':
        this.stage = 'All';
        break;
      default:
        this.stage = Stage[this.props.stage] || 'ALL';
    }

    let docDefinition = {
      content: this.generateContent(),
      defaultStyle: {
        fontSize: 12,
        font: 'Arial',
      },
      pageOrientation: 'landscape',
      pageSize: 'A3'
    };
    return pdfMake.createPdf(
      // @ts-ignore
      docDefinition, tableLayout, fonts, vfs
    ).download(this.filename);
  }

  get filename() {
    if (this.stage === 'All') {
      return (this.props.startDate && this.props.endDate)
        ? `Certification results for ${dayjs(this.props.startDate).format('DDMMMYYYY')} - ${dayjs(this.props.endDate).format('DDMMMYYYY')}.pdf`
        : `Certification results of all time.pdf`
    }

    return `${this.stage}.pdf`
  }
  render() {
    return <button
      className="btn btn-sm btn-outline-success"
      onClick={this.export}
    >save to PDF</button>
  }
}

export default ListExport;