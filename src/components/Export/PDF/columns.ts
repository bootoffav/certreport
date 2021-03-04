const tableStructures = {
  all: {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'state.stage',
      'lastActionDate',
      'title',
      'state.article',
      'state.testReport',
      'state.certificate',
      'state.standardsResult',
      'state.price',
      'state.rem',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Status',
      'L. A. D.',
      'Task',
      'Article',
      'Test report',
      'Certificate',
      'Standards',
      'Price',
      'REM',
    ],
    widths: [20, 40, 70, 40, 70, 70, '*', 100, 100, 100, 100, 70, 80],
  },
  overdue: {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'state.stage',
      'lastActionDate',
      'nextActionDate',
      'title',
      'state.testFinishedOnPlanDate',
      'state.testFinishedOnRealDate',
      'state.certReceivedOnPlanDate',
      'state.certReceivedOnRealDate',
      'state.standardsResult',
      'state.pretreatment1Result',
      'state.price',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Status',
      'L. A. D.',
      'N. A. D.',
      'Task',
      'ETD (Test-report)',
      'Test really finished on',
      'ETD (Certificate)',
      'Certificate really received on',
      'Standards',
      'Pre-treatment Result',
      'Price',
    ],
    widths: [20, 40, 70, 40, 70, 70, 70, '*', 70, 70, 70, 70, 70, 70, 70],
  },
  ongoing: {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'state.stage',
      'title',
      'state.article',
      'state.testReport',
      'state.certReceivedOnRealDate',
      'state.resume',
      'state.price',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Status',
      'Task',
      'Article',
      'Test report',
      'Certificates really received on',
      'Result',
      'Price',
    ],
    widths: [20, 40, 70, 40, 70, '*', 90, 90, 70, 70, 70],
  },
};

function getTableStructure(stage: 'all' | 'overdue' | 'ongoing') {
  return tableStructures[stage];
}

// accessors = this.props.columns.map((col: any) => {
//   return typeof col.accessor != 'function' ? col.accessor : `state.${col.id}`;
// });

// headers = this.props.columns.map(({ Header }: any) => this.boldText(Header));
// widths = this.props.columns.map(({ accessor, minWidth, width }: any) => {
//   switch (accessor) {
//     case 'title':
//       return 'auto';
//     case 'state.readyOn':
//       return 70;
//     case 'state.article':
//       return 130;
//     default:
//       return minWidth || width || '*';
//   }
// });

export { getTableStructure };
