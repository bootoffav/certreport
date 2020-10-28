export interface IState {
  standardsResult: {
    [key: string]: 'pass' | 'fail';
  };
  attachedFiles: any;
  DBState: any;
  EN11612Detail?: any;
  link: string;
  news: string;
  testingTime: string;
  serialNumber: string;
  applicantName: string;
  testingCompany: string;
  stage: string;
  standards: string;
  price: string;
  paid: boolean;
  paymentDate: string;
  proformaReceived: string;
  proforma: string;
  proformaReceivedDate: string;
  proformaNumber: string;
  price2: string;
  paid2: boolean;
  paymentDate2: string;
  proformaReceived2: string;
  proformaReceivedDate2: string;
  proformaNumber2: string;
  article: string;
  product: string;
  code: string;
  colour: string;
  testReport: string;
  certificate: string;
  materialNeeded: string;
  pretreatment1: string;
  pretreatment1Result: string;
  pretreatment2: string;
  pretreatment3: string;
  length: string;
  width: string;
  partNumber: string;
  rollNumber: string;
  brand: string;
  pausedUntil: string;
  readyOn: string;
  sentOn: string;
  receivedOn: string;
  startedOn: string;
  testFinishedOnPlanDate: string;
  testFinishedOnRealDate: string;
  certReceivedOnPlanDate: string;
  certReceivedOnRealDate: string;
  comments: string;
  otherTextInDescription: string | null;
  resume: undefined | 'fail' | 'pass' | 'no sample' | 'partly';
}

const emptyState: IState = {
  standardsResult: {},
  DBState: {
    testRequirement: [[], [], [], [], [], [], [], [], []],
    washPreTreatment: [[], []],
    footer: [[], []],
    cycles: ['5', ''],
    washTemp: '60',
    otherStandard1: 'According to Standard Mandotory Test Requirement',
    otherStandard2: 'According to Standard Mandotory Test Requirement',
  },
  attachedFiles: [],
  EN11612Detail: {},
  resume: undefined,
  link: '',
  paid: false,
  proforma: '',
  paid2: false,
  news: '',
  length: '1',
  stage: '',
  testingTime: '21',
  width: '1.5',
  proformaReceivedDate: '',
  proformaReceivedDate2: '',
  pausedUntil: '',
  readyOn: '',
  sentOn: '',
  receivedOn: '',
  startedOn: '',
  testFinishedOnPlanDate: '',
  testFinishedOnRealDate: '',
  certReceivedOnPlanDate: '',
  certReceivedOnRealDate: '',
  paymentDate: '',
  paymentDate2: '',
  proformaReceived: '',
  proformaReceived2: '',
  proformaNumber: '',
  proformaNumber2: '',
  applicantName: '',
  product: '',
  code: '',
  article: '',
  colour: '',
  partNumber: '',
  rollNumber: '',
  serialNumber: '',
  materialNeeded: '',
  standards: '',
  testingCompany: '',
  brand: '',
  price: '',
  price2: '',
  comments: '',
  testReport: '',
  certificate: '',
  pretreatment1: '',
  pretreatment1Result: '',
  pretreatment2: '',
  pretreatment3: '',
  otherTextInDescription: '',
};

const brand = [
  { value: 'C_10033', label: 'XMT' },
  { value: 'C_10035', label: 'XMF' },
  { value: 'C_10037', label: 'XMS' },
  { value: 'C_10041', label: 'XMG' },
  { value: '', label: 'No brand' },
];

export { emptyState, brand };
