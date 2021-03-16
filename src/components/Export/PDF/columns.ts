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
  '00. Paused': {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'title',
      'nextActionDate',
      'state.article',
      'state.testReport',
      'state.preTreatment1Result',
      'state.price',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Task',
      'Sample NAD',
      'Article',
      'Test report',
      'Pre-treatment Result',
      'Price',
    ],
    widths: [20, 40, 70, 40, '*', 70, 70, 70, 70, 70],
  },
  '01. Canceled': {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'title',
      'nextActionDate',
      'state.article',
      'state.testReport',
      'state.preTreatment1Result',
      'state.price',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Task',
      'Sample NAD',
      'Article',
      'Test report',
      'Pre-treatment Result',
      'Price',
    ],
    widths: [20, 40, 70, 40, '*', 70, 70, 70, 70, 70],
  },
  '02. Estimate': {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'title',
      'nextActionDate',
      'state.article',
      'state.testReport',
      'state.preTreatment1Result',
      'state.price',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Task',
      'Sample NAD',
      'Article',
      'Test report',
      'Pre-treatment Result',
      'Price',
    ],
    widths: [20, 40, 70, 40, '*', 70, 70, 70, 70, 70],
  },
  '0. Sample to be prepared': {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'title',
      'nextActionDate',
      'state.article',
      'state.preTreatment',
      'state.price',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Task',
      'Sample NAD',
      'Article',
      'Wash',
      'Price',
    ],
    widths: [20, 40, 70, 40, '*', 70, 70, 70, 70],
  },
  '1. Sample Sent': {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'title',
      'nextACtionDate',
      'state.sentOn',
      'state.article',
      'state.testReport',
      'state.price',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Task',
      'Sample NAD',
      'Sent On',
      'Article',
      'Test report',
      'Price',
    ],
    widths: [20, 40, 70, 40, '*', 70, 70, 70, 70, 70],
  },
  '2. Sample Arrived': {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'title',
      'state.sentOn',
      'state.receivedOn',
      'state.article',
      'state.testReport',
      'state.price',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Task',
      'Sent On',
      'Sample is received On',
      'Article',
      'Test report',
      'Price',
    ],
    widths: [20, 40, 70, 40, '*', 70, 70, 70, 70, 70],
  },
  '3. PI Issued': {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'title',
      'state.proformaReceivedDate',
      'state.proformaNumber',
      'state.paymentDate',
      'state.testFinishedOnPlanDate',
      'state.certReceivedOnPlanDate',
      'state.resume',
      'state.price',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Task',
      'Proforma date',
      'Proforma #',
      'Payment date',
      'ETD (Test-report)',
      'ETD (Certificate)',
      'Result',
      'Price',
    ],
    widths: [20, 40, 70, 40, '*', 70, 70, 70, 70, 70, 70, 70],
  },
  '4. Payment Done': {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'title',
      'state.proformaReceivedDate',
      'state.proformaNumber',
      'state.paymentDate',
      'state.certReceivedOnPlanDate',
      'state.standards',
      'state.price',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Task',
      'Proforma Date',
      'Proforma #',
      'Payment Date',
      'ETD (Certificate)',
      'Standards',
      'Price',
    ],
    widths: [20, 40, 70, 40, '*', 70, 70, 70, 70, 70, 70],
  },
  '5. Testing is started': {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'title',
      'state.paymentDate',
      'state.article',
      'state.testFinishedOnPlanDate',
      'state.testReport',
      'state.certReceivedOnPlanDate',
      'state.standards',
      'state.price',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Task',
      'Payment date',
      'Article',
      'ETD (Test-report)',
      'Test report',
      'ETD (Certificate)',
      'Standards',
      'Price',
    ],
    widths: [20, 40, 70, 40, '*', 70, 70, 70, 70, 70, 70, 70],
  },
  '6. Pre-treatment done': {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'title',
      'state.article',
      'state.testReport',
      'state.certReceivedOnRealDate',
      'state.result',
      'state.price',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Task',
      'Article',
      'Test report',
      'Certificate really received on',
      'Result',
      'Price',
    ],
    widths: [20, 40, 70, 40, '*', 70, 70, 70, 70, 70],
  },
  '7. Test-report ready': {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'state.testFinishedOnRealDate',
      'title',
      'state.testFinishedOnPlanDate',
      'state.certReceivedOnPlanDate',
      'state.standards',
      'state.resume',
      'state.preTreatment1Result',
      'state.partNumber',
      'Price',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Test-report received',
      'Task',
      'ETD (Test-report)',
      'ETD (Certificate)',
      'Standards',
      'Result',
      'Pre-treatment Result',
      'Part #',
      'Price',
    ],
    widths: [20, 40, 70, 40, 70, '*', 70, 70, 70, 70, 70, 70, 70, 70],
  },
  '8. Certificate ready': {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'state.certReceivedOnRealDate',
      'title',
      'state.finishedOn',
      'state.paymentDate',
      'state.testFinishedOnPlanDate',
      'state.certReceivedOnPlanDate',
      'state.certReceivedOnRealDate',
      'state.standards',
      'state.resume',
      'state.preTreatment1Result',
      'state.price',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Cert received',
      'Task',
      'Tests to be finished On',
      'Payment Date',
      'ETD (Test-report)',
      'ETD (Certificate)',
      'Certificate really received on',
      'Standards',
      'Result',
      'Pre-treatment Result',
      'Price',
    ],
    widths: [20, 40, 70, 40, 70, '*', 70, 70, 70, 70, 70, 70, 70, 70, 70],
  },
  '9. Ended': {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
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
      'Task',
      'Article',
      'Test report',
      'Certificate really received on',
      'Result',
      'Price',
    ],
    widths: [20, 40, 70, 40, '*', 70, 70, 70, 70, 70],
  },
  '10. Repeat Testing is started': {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'title',
      'state.article',
      'state.testReport',
      'state.repeatCertReceivedOnPlanDate',
      'state.resume',
      'state.price',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Task',
      'Article',
      'Test report',
      '*R Certificate really received on',
      'Result',
      'Price',
    ],
    widths: [20, 40, 70, 40, '*', 70, 70, 70, 70, 70],
  },
  '11. Repeat Test-report ready': {
    accessors: [
      'position',
      'state.serialNumber',
      'createdDate',
      'state.brand',
      'title',
      'state.article',
      'state.testReport',
      'state.repeatCertReceivedOnRealDate',
      'state.resume',
      'state.price',
    ],
    headers: [
      '#',
      '##',
      'Created',
      'XM_',
      'Task',
      'Article',
      'Test report',
      '*R Certificate really received on',
      'Result',
      'Price',
    ],
    widths: [20, 40, 70, 40, '*', 70, 70, 70, 70, 70],
  },
};

function getTableStructure(stage: 'ongoing' | 'overdue' | 'all') {
  return tableStructures[stage];
}

export { getTableStructure };
