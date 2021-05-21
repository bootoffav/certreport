import { Component } from 'react';
import pdfMake from 'pdfmake/build/pdfmake';
import dayjs from 'dayjs';
import { vfs } from './vfs_fonts.js';
import * as tableStructures from './columns';

import { tableLayout, fonts } from './settings';

class ListExport extends Component<{
  tasks: any;
  columns: any;
  stage: any;
  startDate?: Date;
  endDate?: Date;
}> {
  totalPrice = 0;
  stage: string | undefined;

  generateContent() {
    var { accessors, headers, widths } = tableStructures.getTableStructure(
      this.props.stage
    );

    const table = {
      table: {
        widths,
        body: [
          headers,
          ...[...this.genRow(this.props.tasks, accessors)]
            // sort by increasing SerialNumber
            .sort((a: any, b: any) => {
              if (a[1] < b[1]) {
                return -1;
              }
              if (a[1] > b[1]) {
                return 1;
              }
              return 0;
            }),
        ],
      },
    };

    for (let i = 0; i < table.table.body.length; i++) {
      if (i === 0) continue;
      table.table.body[i][0] = i;
    } // for column # make right count

    // add TotalPrice
    table.table.body.push([
      { text: '', colSpan: accessors.length - 1 }, // empty columns
      ...Array(accessors.length - 2).fill({ text: '', border: 'none' }), // required by pdkMake
      {
        alignment: 'right',
        text: `€${Math.round(this.totalPrice)
          .toLocaleString()
          .replace(/,/g, ' ')}`,
      },
    ]);

    return [
      { text: this.stage, fontSize: 30, alignment: 'center', margin: [5, 4] },
      table,
    ];
  }

  boldText = (text: string) => ({
    text,
    fontSize: 16,
    alignment: 'center',
    bold: true,
  });

  *genRow(tasks: any, accessors: any) {
    for (let i = 0; i < tasks.length; i++) {
      const row: any = [];

      accessors.forEach((acc: string) => {
        switch (acc) {
          case 'createdDate':
            row.push({
              text: dayjs(tasks[i][acc]).format('DDMMMYYYY'),
            });
            break;
          case 'title':
            row.push({
              text: tasks[i][acc],
              color: 'blue',
              link: `${process.env.REACT_APP_B24_HOST}/company/personal/user/${process.env.REACT_APP_B24_USER_ID}/tasks/task/view/${tasks[i].id}/`,
            });
            break;
          case 'state.article':
            row.push({
              ...this.boldText(tasks[i].state.article),
              alignment: 'left',
            });
            break;
          case 'state.certificate':
            const files = tasks[i]['UF_TASK_WEBDAV_FILES'] || [];
            row.push(
              files.map((file: any) => ({
                text: `${file.NAME}`,
                decoration: 'underline',
                color: 'blue',
                link: `${process.env.REACT_APP_B24_HOST}${file.VIEW_URL}`,
              }))
            );
            break;
          case 'state.standardsResult':
            const colorMap: {
              [key: string]: any;
            } = {
              pass: 'green',
              fail: 'red',
              undefined: 'black',
            };
            const results = [
              {
                text: 'Result: ' + (tasks[i].state.resume || 'none'),
                color: colorMap[tasks[i].state.resume],
              },
            ];
            for (let [standard, result] of Object.entries(
              tasks[i].state.standardsResult
            )) {
              results.push({
                text: `${standard} - ${result}`,
                color: result === 'pass' ? 'green' : 'red',
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
            this.totalPrice += Number(
              tasks[i].state.price1 || 0 + tasks[i].state.price2 || 0
            );
            row.push({
              alignment: 'right',
              text:
                tasks[i].state.price === ''
                  ? '€ 0'
                  : `€${Math.round(
                      tasks[i].state.price1 || 0 + tasks[i].state.price2 || 0
                    )
                      .toLocaleString()
                      .replace(/,/g, ' ')}`,
            });
            break;
          default:
            acc.includes('state.') && !!tasks[i].state[acc.substring(6)]
              ? row.push(tasks[i].state[acc.substring(6)])
              : row.push(tasks[i][acc] || '');
        }
      });

      yield row;
    }
  }

  export = () => {
    switch (this.props.stage) {
      case 'overdue':
        this.stage = `Overdue Certifications in Testing Lab (on ${dayjs().format(
          'DD.MM.YYYY'
        )})`;
        break;
      default:
        this.stage = this.props.stage;
    }

    let docDefinition = {
      content: this.generateContent(),
      defaultStyle: {
        fontSize: 12,
        font: 'Arial',
      },
      pageOrientation: 'landscape',
      pageSize: 'A3',
    };
    return pdfMake
      .createPdf(
        // @ts-ignore
        docDefinition,
        tableLayout,
        fonts,
        vfs
      )
      .download(this.getFilename());
  };

  getFilename = () =>
    this.props.startDate && this.props.endDate
      ? `Certification list for ${dayjs(this.props.startDate).format(
          'DDMMMYYYY'
        )} - ${dayjs(this.props.endDate).format('DDMMMYYYY')}.pdf`
      : `Certification list - ${this.props.stage}.pdf`;

  render() {
    return (
      <button className="btn btn-sm btn-outline-success" onClick={this.export}>
        PDF export
      </button>
    );
  }
}

export { ListExport };
