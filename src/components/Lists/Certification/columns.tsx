import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { Icon } from 'tabler-react';
import { dateConverter, printStage } from '../../../helpers';
import type { CellInfo } from 'react-table';

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

function getColumns(totalPrice: number, stage?: string) {
  const allColumns = [
    {
      // 0
      Header: '#',
      id: 'position',
      sortable: false,
      Cell: (row: any) => {
        return row.viewIndex + 1;
      },
      width: 30,
    },
    {
      // 1
      Header: '##',
      id: 'serialNumber',
      accessor: 'state.serialNumber',
      width: 48,
      Cell: (props: any) => (
        <a
          href={`https://xmtextiles.bitrix24.ru/company/personal/user/460/tasks/task/view/${props.original.id}/`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {props.value}
        </a>
      ),
    },
    {
      // 2
      Header: 'Created',
      id: 'createdDate',
      accessor: 'createdDate',
      width: 80,
      Cell: ({ value }: CellInfo) => dayjs(value).format('DD.MM.YYYY'),
    },
    {
      // 3
      Header: 'XM_',
      id: 'brand',
      accessor: 'state.brand',
      width: 37,
    },
    {
      // 4
      Header: 'Status',
      id: 'stage',
      accessor: 'state.stage',
      Cell: ({ value: stage }: CellInfo) => printStage(stage, 'table'),
      width: 60,
    },
    {
      //5
      Header: 'L. A. D.',
      id: 'lastActionDate',
      accessor: 'lastActionDate',
      sortMethod: sortDates,
      width: 79,
    },
    {
      // 6
      Header: 'N. A. D.',
      id: 'nextActionDate',
      accessor: 'nextActionDate',
      sortMethod: sortDates,
    },
    {
      // 7
      Header: 'Cert received',
      id: 'certReceivedDate',
      accessor: 'state.certReceivedOnRealDate',
      minWidth: 100,
      sortMethod: sortDates,
    },
    {
      // 8
      Header: 'Test-report received',
      id: 'testReceivedDate',
      accessor: 'state.testFinishedOnRealDate',
      minWidth: 100,
      sortMethod: sortDates,
    },
    {
      // 9
      Header: 'Task',
      accessor: 'title',
      id: 'taskName',
      minWidth: 550,
      Cell: ({ original, value }: CellInfo) => (
        <Link to={`/edit/${original.id}`} style={{ textDecoration: 'none' }}>
          {value}
        </Link>
      ),
    },
    {
      // 10
      Header: 'Sample NAD',
      accessor: 'state.readyOn',
      id: 'readyOn',
      width: 130,
      sortMethod: sortDates,
    },
    {
      // 11
      Header: 'Sent On',
      accessor: 'state.sentOn',
      id: 'sentOn',
      width: 130,
      sortMethod: sortDates,
    },
    {
      // 12
      Header: 'Sample has received On',
      accessor: 'state.receivedOn',
      id: 'receivedOn',
      width: 130,
      sortMethod: sortDates,
    },
    {
      // 13
      Header: 'Tests to be finished On',
      accessor: 'state.finishedOn',
      id: 'receivedOn',
      width: 130,
      sortMethod: sortDates,
    },
    {
      // 14
      Header: 'Proforma date',
      accessor: 'state.proformaReceivedDate',
      id: 'proformaReceivedDate',
      width: 130,
      sortMethod: sortDates,
    },
    {
      // 15
      Header: 'Proforma #',
      accessor: 'state.proformaNumber',
      id: 'proformaNumber',
      width: 100,
    },
    {
      // 16
      Header: 'Paid',
      id: 'paid',
      accessor: 'state.paymentDate1',
      minWidth: 40,
      Cell: (props: any) =>
        props.value ? <span className="oi oi-check"> </span> : '',
      sortMethod: sortDates,
    },
    {
      // 17
      Header: 'Payment date',
      id: 'paymentDate',
      accessor: 'state.paymentDate1',
      width: 130,
      sortMethod: sortDates,
    },
    {
      // 18
      Header: 'Article',
      id: 'article',
      accessor: 'state.article',
      width: 100,
    },
    {
      // 19
      Header: 'ETD (Test-report)',
      id: 'etdTestReport',
      accessor: 'state.testFinishedOnPlanDate',
      minWidth: 100,
      sortMethod: sortDates,
    },
    {
      // 20
      Header: 'Test report',
      id: 'testReport',
      accessor: 'state.testReport',
      minWidth: 100,
    },
    {
      // 21
      Header: 'Test really finished on',
      id: 'testFinishedOnRealDate',
      accessor: 'state.testFinishedOnRealDate',
      minWidth: 100,
    },
    {
      // 22
      Header: 'ETD (Certificate)',
      id: 'etdCertificate',
      accessor: 'state.certReceivedOnPlanDate',
      minWidth: 100,
      sortMethod: sortDates,
    },
    {
      // 23
      Header: 'Certificate really received on',
      id: 'certReceivedOnRealDate',
      accessor: 'state.certReceivedOnRealDate',
      minWidth: 100,
      sortMethod: sortDates,
    },
    {
      // 24
      Header: 'Standards',
      id: 'standards',
      accessor: 'state.standards',
      minWidth: 100,
      Cell: ({ original }: any) =>
        original.state.standards
          .split(', ')
          .map((st: string, i: number, stArr: string[]) => {
            const lastItem = stArr.length !== i + 1;
            switch (original.state.standardsResult[st]) {
              case 'pass':
                return (
                  <div key={i}>
                    {st}{' '}
                    <Icon
                      prefix="fe"
                      width="60"
                      className="greenIcon"
                      name="thumbs-up"
                    />
                    {lastItem ? <br /> : ''}
                  </div>
                );
              case 'fail':
                return (
                  <div key={i}>
                    {st}{' '}
                    <Icon
                      prefix="fe"
                      width="60"
                      className="redIcon"
                      name="thumbs-down"
                    />
                    {lastItem ? <br /> : ''}
                  </div>
                );
            }
            return (
              <div key={i}>
                {st}
                {lastItem ? <br /> : ''}
              </div>
            );
          }),
    },
    {
      // 25
      Header: 'Result',
      id: 'result',
      accessor: 'state.resume',
      minWidth: 50,
      Cell: (props: any) => {
        switch (props.value) {
          case 'fail':
            return (
              <Icon
                prefix="fe"
                width="60"
                className="redIcon"
                name="thumbs-down"
              />
            );
          case 'pass':
            return (
              <Icon
                prefix="fe"
                width="60"
                className="greenIcon"
                name="thumbs-up"
              />
            );
          case 'partly':
            return (
              <Icon
                prefix="fe"
                width="60"
                className="yellowIcon"
                name="alert-circle"
              />
            );
          case 'no sample':
            return 'NO Sample';
          default:
            return '';
        }
      },
    },
    {
      // 26
      Header: 'Pre-treatment Result',
      id: 'pretreatment1',
      accessor: 'state.pretreatment1Result',
      Cell: (props: any) => {
        switch (props.value) {
          case 'fail':
            return (
              <Icon
                prefix="fe"
                width="60"
                className="redIcon"
                name="thumbs-down"
              />
            );
          case 'pass':
            return (
              <Icon
                prefix="fe"
                width="60"
                className="greenIcon"
                name="thumbs-up"
              />
            );
          default:
            return '';
        }
      },
    },
    {
      // 27
      Header: 'News',
      id: 'news',
      accessor: 'state.news',
      Cell: ({ value }: any) =>
        value ? (
          <a
            href={`https://${value}`}
            style={{
              overflow: 'break-word',
              wordWrap: 'break-word',
            }}
            target="_blank"
            rel="noopener noreferrer"
          >{`https://${value}`}</a>
        ) : (
          ''
        ),
    },
    {
      // 28
      Header: 'Part #',
      id: 'partNumber',
      accessor: 'state.partNumber',
    },
    {
      // 29
      Header: 'Wash',
      id: 'wash',
      accessor: 'state.pretreatment1',
    },
    {
      // 30
      Header: 'Price, €',
      Footer: (
        <>
          Total:{' '}
          <span style={{ float: 'right' }}>{formatPrice(totalPrice)}</span>
        </>
      ),
      id: 'price',
      accessor: ({ state }: any) => (+state.price1 || 0) + (+state.price2 || 0),
      minWidth: 90,
      Cell: (props: any) => (
        <span style={{ float: 'right' }}>{formatPrice(props.value)}</span>
      ),
    },
    {
      // 31
      Header: 'REM',
      id: 'rem',
      accessor: 'state.rem',
      minWidth: 90,
    },
  ].map((column) => ({
    ...column,
    style: {
      whiteSpace: 'unset',
      maxHeight: '60px',
    },
  }));

  const takeColumns = (columnPositions: number[]) => {
    return [0, ...columnPositions].map((num: number) => allColumns[num]);
  };

  switch (stage) {
    case '00. Paused':
    case '01. Canceled':
    case '02. Estimate':
      return takeColumns([1, 2, 3, 9, 10, 18, 20, 26, 30]);
    case '0. Sample to be prepared':
      return takeColumns([1, 2, 3, 9, 10, 18, 29, 30]);
    case '1. Sample Sent':
      return takeColumns([1, 2, 3, 9, 10, 11, 18, 20, 30]);
    case '2. Sample Arrived':
      return takeColumns([1, 2, 3, 9, 11, 12, 18, 20, 30]);
    case '3. PI Issued':
      return takeColumns([1, 2, 3, 9, 14, 15, 17, 19, 22, 25, 30]);
    case '4. Payment Done':
      return takeColumns([1, 2, 3, 9, 14, 15, 16, 17, 22, 24, 30]);
    case '5. Testing is started':
      return takeColumns([1, 2, 3, 9, 17, 18, 19, 20, 22, 24, 30]);
    case '7. Test-report ready':
      return takeColumns([1, 2, 3, 8, 9, 19, 21, 22, 24, 25, 26, 28, 30]);
    case '8. Certificate ready':
      return takeColumns([1, 2, 3, 7, 9, 13, 17, 19, 22, 23, 24, 25, 26, 30]);
    case 'all':
      return takeColumns([1, 2, 3, 4, 5, 9, 18, 20, 23, 24, 30, 31]);
    case 'overdue':
      return takeColumns([1, 2, 3, 4, 5, 6, 9, 19, 21, 22, 23, 24, 26, 30]);
    default:
      return takeColumns([1, 2, 3, 4, 9, 18, 20, 23, 25, 30]);
  }
}

function formatPrice(price: number) {
  return price
    .toLocaleString('en-US', {
      style: 'currency',
      currency: 'EUR',
    })
    .replace(/,/g, ' ')
    .replace(/\./g, ',');
}

export { getColumns };
