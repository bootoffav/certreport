import { Link } from 'react-router-dom';
import React from 'react';
import { dateConverter } from '../../helpers';
import dayjs from 'dayjs';

function sortDates(a: string | undefined, b: string | undefined): number {
  if (a === undefined) return -1;
  if (a !== undefined && b !== undefined) {
    if (dateConverter(a) > dateConverter(b)) {
      return 1;
    }
    if (dateConverter(a) < dateConverter(b)) {
      return -1;
    }
  }
  return 0;
}

function getColumns(totalPrice: number, requiredStage?: string) {

  const columns = [{
    // 0
    Header: '#',
    id: 'position',
    sortable: false,
    accessor: 'position',
    width: 30
  }, {
    // 1
    Header: '##',
    id: 'serialNumber',
    accessor: ({ state }: any) => state.serialNumber,
    width: 48,
    Cell: (props: any) => <a
    href={`https://xmtextiles.bitrix24.ru/company/personal/user/460/tasks/task/view/${props.original.ID}/`}
    target="_blank" rel="noopener noreferrer"
    >{props.value}</a>
  }, {
    // 2
    Header: 'Created',
    id: 'createdDate',
    accessor: 'CREATED_DATE',
    width: 80,
    Cell: ({ value }: any) => dayjs(value).format('DD.MM.YYYY')
  }, {
    // 3
    Header: 'XM_',
    id: 'brand',
    accessor: 'state.brand',
    width: 37,
  }, {
    // 4
    Header: 'Status',
    id: 'stage',
    accessor: 'state.stage',
    width: 160
  }, {
    //5
    Header: 'L. A. D.',
    id: 'lastActionDate',
    accessor: 'lastActionDate',
    sortMethod: sortDates,
    width: 79
  }, {
    // 6
    Header: 'N. A. D.',
    id: 'nextActionDate',
    accessor: 'nextActionDate',
    sortMethod: sortDates
  }, {
    // 7
    Header: 'Cert received',
    id: 'certReceivedDate',
    accessor: 'state.certReceivedOnRealDate',
    minWidth: 100,
    sortMethod: sortDates
  }, {
    // 8
    Header: 'Test-report received',
    id: 'testReceivedDate',
    accessor: 'state.testFinishedOnRealDate',
    minWidth: 100,
    sortMethod: sortDates
  }, {
    // 9
    Header: 'Task',
    accessor: 'TITLE',
    id: 'taskName',
    minWidth: 550,
    Cell: ({ original, value }: any) =>
      <Link
        to={`/edit/${original.ID}`}
        target="_blank" rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >{value}</Link>
  }, {
    // 10
    Header: 'Sample NAD',
    accessor: 'state.readyOn',
    id: 'readyOn',
    width: 130,
    sortMethod: sortDates
  }, {
    // 11
    Header: 'Sent On',
    accessor: 'state.sentOn',
    id: 'sentOn',
    width: 130,
    sortMethod: sortDates
  }, {
    // 12
    Header: 'Sample has received On',
    accessor: 'state.receivedOn',
    id: 'receivedOn',
    width: 130,
    sortMethod: sortDates
  }, {
    // 13
    Header: 'Tests to be finished On',
    accessor: 'state.finishedOn',
    id: 'receivedOn',
    width: 130,
    sortMethod: sortDates
  }, {
    // 14
    Header: 'Proforma date',
    accessor: 'state.proformaReceivedDate',
    id: 'proformaReceivedDate',
    width: 130,
    sortMethod: sortDates
  }, {
    // 15
    Header: 'Proforma #',
    accessor: 'state.proformaNumber',
    id: 'proformaNumber',
    width: 100,
  }, {
    // 16
    Header: 'Paid',
    id: 'paid',
    accessor: 'state.paymentDate',
    minWidth: 40,
    Cell: (props: any) => props.value
      ? <span className="oi oi-check"> </span>
      : '',
    sortMethod: sortDates
  }, {
    // 17
    Header: 'Payment date',
    id: 'paymentDate',
    accessor: 'state.paymentDate',
    width: 130,
    sortMethod: sortDates
  }, {
    // 18
    Header: 'Fabric',
    id: 'article',
    accessor: 'state.article',
    width: 100
  }, {
    // 19
    Header: 'ETD (Test-report)',
    id: 'etdTestReport',
    accessor: 'state.testFinishedOnPlanDate',
    minWidth: 100,
    sortMethod: sortDates
  }, {
    // 20
    Header: 'Test report',
    id: 'testReport',
    accessor: 'state.testReport',
    minWidth: 100,
  }, {
    // 21
    Header: 'Test really finished on',
    id: 'testFinishedOnRealDate',
    accessor: 'state.testFinishedOnRealDate',
    minWidth: 100,
  }, {
    // 22
    Header: 'ETD (Certificate)',
    id: 'etdCertificate',
    accessor: 'state.certReceivedOnPlanDate',
    minWidth: 100,
    sortMethod: sortDates
  }, {
    // 23
    Header: 'Certificate',
    id: 'certificate',
    accessor: (row: any) =>
      ['7. Test-report ready', '8. Certificate ready', '9. Ended'].includes(row.state.stage)
        ? row.UF_TASK_WEBDAV_FILES.map((file: any, key: number) => <div key={key}><a href={`https://xmtextiles.bitrix24.ru${file.DOWNLOAD_URL}`}>{file.NAME}</a></div>)
        : row.state.certificate,
    minWidth: 100,
  }, {
    // 24
    Header: 'Certificate really received on',
    id: 'certReceivedOnRealDate',
    accessor: 'state.certReceivedOnRealDate',
    minWidth: 100,
    sortMethod: sortDates
  }, {
    // 25
    Header: 'Standards',
    id: 'standards',
    accessor: 'state.standards',
    minWidth: 100,
    Cell: ({ original }: any) =>
      original.state.standards.split(', ').map((st: string, i: number, stArr: string[]) => {
        const lastItem = stArr.length !== i + 1;
        switch (original.state.standardsResult[st]) {
          case 'pass':
            return <div key={i}>{st} <span className="oi oi-thumb-up"></span>{lastItem ? <br /> : ''}</div>
          case 'fail':
            return <div key={i}>{st} <span className="oi oi-circle-x"></span>{lastItem ? <br /> : ''}</div>
        }
        return <div key={i}>{st}{lastItem ? <br /> : ''}</div>
      })
  }, {
    // 26
    Header: 'Result',
    id: 'result',
    accessor: 'state.resume',
    minWidth: 50,
    Cell: (props: any) => {
      switch (props.value) {
        case 'fail':
          return <span className="oi oi-circle-x"></span>;
        case 'pass':
          return <span className="oi oi-thumb-up"></span>;
        case 'no sample':
          return 'NO Sample';
        default:
          return '';
      }
    }
  }, {
    // 27
    Header: 'Pre-treatment Result',
    id: 'pretreatment1',
    accessor: 'state.pretreatment1Result',
    Cell: (props: any) => {
      switch (props.value) {
        case 'fail':
          return <span className="oi oi-circle-x"></span>;
        case 'pass':
          return <span className="oi oi-thumb-up"></span>;
        default:
          return '';
      }
    }
  }, {
    // 28
    Header: 'News',
    id: 'news',
    accessor: 'state.news',
    style: { 'whiteSpace': 'unset' },
    Cell: ({ value }: any) => value
      ?
      <a href={`https://${value}`}
        style={{
          'overflow': 'break-word',
          'wordWrap': 'break-word'
      }}
        target="_blank" rel="noopener noreferrer"
      >{`https://${value}`}</a>
      : ''
  }, {
    // 29
    Header: 'Part #',
    id: 'partNumber',
    accessor: 'state.partNumber'
  }, {
    // 30
    Header: 'Wash',
    id: 'wash',
    accessor: 'state.pretreatment1'
  }, {
    // 31
    Header: 'Price, €',
    Footer: <>Total: < span style={{ float: 'right' }}>{formatPrice(totalPrice)}</span></>,
    id: 'price',
    accessor: 'state.price',
    minWidth: 90,
    Cell: (props: any) => <>€<span style={{ float: 'right' }}>{formatPrice(props.value)}</span></>
  }];

  // @ts-ignore
  columns.forEach(col => col.show = true);
  let hidden: number[];
  switch (requiredStage) {
    case '00. Paused':
      hidden = [4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 19, 21, 22, 23, 24, 25, 26, 28, 29, 30];
      break;
    case '0. Sample to be prepared':
      hidden = [2, 4, 5, 6, 7, 8, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28];
      break;
    case '1. Sample Sent':
      hidden = [4, 5, 6, 7, 8, 12, 13, 14, 15, 16, 17, 19, 21, 22, 24, 25, 26, 27, 28, 29, 30];
      break;
    case '2. Sample Arrived':
      hidden = [4, 5, 6, 7, 8, 10, 13, 14, 15, 16, 17, 19, 21, 22, 24, 25, 26, 27, 28, 29, 30];
      break;
    case '3. PI Issued':
      hidden = [4, 5, 6, 7, 8, 10, 11, 12, 13, 16, 18, 20, 21, 23, 24, 25, 27, 28, 29, 30];
      break;
    case '4. Payment Done':
      hidden = [4, 5, 6, 7, 8, 10, 11, 12, 13, 18, 19, 20, 21, 23, 24, 26, 27, 28, 29, 30];
      break;
    case '5. Testing is started':
      hidden = [4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 21, 23, 24, 26, 27, 28, 29, 30];
      break;
    case 'results':
      hidden = [6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 22, 24, 26, 27, 29, 30];
      break;
    case 'overdue':
      hidden = [7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 23, 26, 28, 29, 30];
      break;
    case '7. Test-report ready':
      hidden = [4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 24, 28, 20, 30];
      break;
    case '8. Certificate ready':
      hidden = [4, 5, 6, 8, 10, 11, 12, 14, 15, 16, 18, 20, 21, 28, 29, 30];
      break;
    default:
      hidden = [5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 19, 21, 23, 24, 25, 27, 28, 29, 30];
  }

  columns.forEach((col, ind) => {
    // @ts-ignore
    if (hidden.includes(ind)) col.show = false;
  });

  return columns;
}

function formatPrice(price: number) {
  return price.toLocaleString('en-US', {
    style: 'currency', currency: 'EUR'
  }).replace(/,/g, ' ').replace(/\./g, ',')
}

export { getColumns };