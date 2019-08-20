import React from 'react';
import { Link } from 'react-router-dom';
import { Stage } from '../../Task/Task';
import { dateConverter } from '../../helpers';

function getColumns(totalPrice: number, staleData: boolean, requiredStage: Stage | 'results' | 'overdue' | undefined) {
  const columns = [{
    // 0
    Header: '#',
    id: 'position',
    accessor: 'position',
    width: 40
  }, {
    // 1
    Header: '##',
    id: 'serialNumber',
    accessor: (row: any) => row.state.serialNumber && String(row.state.serialNumber),
    width: 55,
    Cell: (props: any) => <a
      href={`https://xmtextiles.bitrix24.ru/company/personal/user/460/tasks/task/view/${props.original.ID}/`}
      target="_blank" rel="noopener noreferrer"
    >{props.value}</a>
  }, {
    // 2
    Header: 'Brand',
    id: 'brand',
    minWidth: 50,
    accessor: 'state.brand'
  }, {
    // 3
    Header: 'Status',
    id: 'stage',
    minWidth: 100,
    accessor: 'state.stage'
  }, {
    //4
    Header: 'Last action date',
    id: 'lastActionDate',
    accessor: 'lastActionDate'
  }, {
    // 5
    Header: 'Cert received',
    id: 'certReceivedDate',
    accessor: 'state.certReceivedOnRealDate',
    minWidth: 100,
    sortMethod: (a: any, b: any) => {
      if (dateConverter(a) > dateConverter(b)) {
        return 1;
      }
      if (dateConverter(a) < dateConverter(b)) {
        return -1;
      }
      return 0;
    }
  }, {
    // 6
    Header: 'Test-report received',
    id: 'testReceivedDate',
    accessor: 'state.testFinishedOnRealDate',
    minWidth: 100,
    sortMethod: (a: any, b: any) => {
      if (dateConverter(a) > dateConverter(b)) {
        return 1;
      }
      if (dateConverter(a) < dateConverter(b)) {
        return -1;
      }
      return 0;
    }
  }, {
    // 7
    Header: 'Task title',
    accessor: 'TITLE',
    id: 'taskName',
    minWidth: 550,
    Cell: (props: any) => props.original.state.serialNumber
      ? <Link className={staleData ? 'EditLinkIsDisabled' : ''}
        to={
          staleData
            ? '' : {
              pathname: `/edit/${props.original.ID}`,
              state: { ...props.original.state }
            }
        }
      >{props.value}</Link>
      : <Link to={{
        pathname: `/edit/${props.original.ID}`,
        state: { ...props.original.state }
      }}> {props.value}</Link>
  }, {
    // 8
    Header: 'Sample to be prepared on',
    accessor: 'state.readyOn',
    id: 'readyOn',
    width: 130,
  }, {
    // 9
    Header: 'Sent On',
    accessor: 'state.sentOn',
    id: 'sentOn',
    width: 130,
  }, {
    // 10
    Header: 'Sample has received On',
    accessor: 'state.receivedOn',
    id: 'receivedOn',
    width: 130,
  }, {
    // 11
    Header: 'Tests to be finished On',
    accessor: 'state.finishedOn',
    id: 'receivedOn',
    width: 130,
  }, {
    // 12
    Header: 'Proforma date',
    accessor: 'state.proformaReceivedDate',
    id: 'proformaReceivedDate',
    width: 130,
  }, {
    // 13
    Header: 'Proforma #',
    accessor: 'state.proformaNumber',
    id: 'proformaNumber',
    width: 100,
  }, {
    // 14
    Header: 'Paid',
    id: 'paid',
    accessor: 'state.paymentDate',
    minWidth: 40,
    Cell: (props: any) => props.value
      ? <span className="oi oi-check"> </span>
      : ''
  }, {
    // 15
    Header: 'Payment date',
    id: 'paymentDate',
    accessor: 'state.paymentDate',
    width: 130,
  }, {
    // 16
    Header: 'Fabric',
    id: 'article',
    accessor: 'state.article',
    width: 100
  }, {
    // 17
    Header: 'ETD (Test-report)',
    id: 'etdTestReport',
    accessor: 'state.testFinishedOnPlanDate',
    minWidth: 100
  }, {
    // 18
    Header: 'Test report',
    id: 'testReport',
    accessor: 'state.testReport',
    minWidth: 100,
  }, {
    // 19
    Header: 'ETD (Certificate)',
    id: 'etdCertificate',
    accessor: 'state.certReceivedOnPlanDate',
    minWidth: 100
  }, {
    // 20
    Header: 'Certificate',
    id: 'certificate',
    accessor: (row: any) => 
      ['7. Test-report ready', '8. Certificate ready', '9. Ended'].includes(row.state.stage)
        ? row.UF_TASK_WEBDAV_FILES.map((file: any, key: number) => <><a key={key} href={`https://xmtextiles.bitrix24.ru${file.DOWNLOAD_URL}`}>{file.NAME}</a><br /></>)
      : row.state.certificate,
    minWidth: 100,
  }, {
    // 21
    Header: 'Standards',
    id: 'standards',
    accessor: 'state',
    minWidth: 100,
    Cell: (props: any) =>
      props.value.standards.split(', ').map((st: string, i: number, stArr: string[]) => {
        const lastItem = stArr.length != i + 1;
        switch (props.value.standardsResult[st]) {
          case undefined:
            return <>{st}{lastItem ? <br /> : ''}</ >
          case 'pass':
            return <>{st} < span className="oi oi-thumb-up" > </span>{lastItem ? <br /> : ''
            }</>
          case 'fail':
            return <>{st} < span className="oi oi-circle-x" > </span>{lastItem ? <br /> : ''}</>
        }
      })
  }, {
    // 22
    Header: 'Result',
    id: 'result',
    accessor: 'state.resume',
    minWidth: 40,
    Cell: (props: any) => {
      switch (props.value) {
        case 'fail':
          return <span className="oi oi-circle-x" > </span>;
        case 'pass':
          return <span className="oi oi-thumb-up" > </span>;
        default:
          return '';
      }
    }
  }, {
    // 23
    Header: 'Price, €',
    Footer: <>Total: < span style={{ float: 'right' }}>{formatPrice(totalPrice)}</span></>,
    id: 'price',
    accessor: 'state.price',
    minWidth: 90,
    Cell: (props: any) => <>€<span style={{ float: 'right' }}>{formatPrice(props.value)}</span></>
  }, {
    // 24
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
  }
  ];

  // @ts-ignore
  columns.forEach(col => col.show = true);
  let hidden: number[];
  switch (requiredStage) {
    case Stage['00. Paused']:
      hidden = [3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15, 17, 19, 20, 21, 22];
      break;
    case Stage['0. Sample to be prepared']:
      hidden = [3, 4, 5, 6, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19, 20, 21, 22];
      break;
    case Stage['1. Sample Sent']:
      hidden = [3, 4, 5, 6, 10, 11, 12, 13, 14, 15, 17, 19, 21, 22, 24];
      break;
    case Stage['2. Sample Arrived']:
      hidden = [3, 4, 5, 6, 8, 11, 12, 13, 14, 15, 17, 19, 21, 22, 24];
      break;
    case Stage['3. PI Issued']:
      hidden = [3, 4, 5, 6, 8, 9, 10, 11, 14, 16, 18, 20, 21, 23, 24];
      break;
    case Stage['4. Payment Done']:
      hidden = [3, 4, 5, 6, 8, 9, 10, 11, 16, 17, 18, 20, 22, 24];
      break;
    case Stage['5. Testing is started']:
      hidden = [3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 20, 21, 22, 24];
      break;
    case 'results':
      hidden = [5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 17, 19, 20, 23];
      break;
    case 'overdue':
      hidden = [5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 23];
      break;
    case Stage['7. Test-report ready']:
      hidden = [3, 5, 8, 9, 10, 12, 13, 14, 16, 18];
      break;
    case Stage['8. Certificate ready']:
      hidden = [3, 4, 6, 8, 9, 10, 12, 13, 14, 16, 18];
      break;
    default:
      hidden = [4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 17, 19, 21, 24];
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