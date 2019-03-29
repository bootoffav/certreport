import B24 from './B24';

let select_options : {
  brand: any[];
  standards: any[];
  testingCompany: any[];
  created: Date;
  articles: [];
  [key: string]: any;
} = {
  brand: [
    {value: 'C_10033', label: 'XMT'},
    {value: 'C_10035', label: 'XMF'},
    {value: 'C_10037', label: 'XMS'},
    {value: 'C_10041', label: 'XMG'}
  ],
  standards: [],
  testingCompany: [
    {value: 'Aitex (Spain)', label: 'Aitex (Spain)'},
    {value: 'Aitex (China)', label: 'Aitex (China)'},
    {value: 'Satra (UK)', label: 'Satra (UK)'}
  ],
  created: new Date(),
  articles: []
};

export interface IState {
  link : string;
  testingTime: string;
  serialNumber: string;
  applicantName : string;
  testingCompany : string;
  standards : string;
  price: number;
  paid: boolean;
  paymentDate : string;
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
  code : string;
  colour: string;
  testReport: string;
  certificate: string;
  materialNeeded: string;
  pretreatment1: string;
  pretreatment2: string;
  pretreatment3: string;
  length: string;
  width: string;
  partNumber: string;
  rollNumber: string;
  brand: string;
  readyOn: string;
  sentOn: string;
  receivedOn: string;
  startedOn: string;
  finishedOn: string;
  resultsReceived: string;
  comments: string;
  otherTextInDescription: string | null;
}

const emptyState : IState = {
  link: '',
  paid: false,
  proforma: '',
  paid2: false,
  length: '1',
  testingTime: '21',
  width: '1.5',
  proformaReceivedDate: '',
  proformaReceivedDate2: '',
  readyOn: '',
  sentOn: '',
  receivedOn: '',
  startedOn: '',
  finishedOn: '',
  resultsReceived: '',
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
  price: 0,
  price2: '',
  comments: '',
  testReport: '',
  certificate: '',
  pretreatment1: '',
  pretreatment2: '',
  pretreatment3: '',
  otherTextInDescription: ''
};

function initApp() {
  let fromStorage;
  let saveAndApply = (data : any, itemName : string) => {
    localStorage.setItem(itemName, JSON.stringify(data));
    select_options[itemName] = data;
  }

  B24.get_products().then(data => saveAndApply(data, 'articles'));
  B24.get_standards().then(data => saveAndApply(data, 'standards'));

  ['articles', 'standards'].forEach(itemName => {
    let fromStorage : any = localStorage.getItem(itemName)
    let parsed = JSON.parse(fromStorage);
    if (typeof parsed === 'string') {
      select_options[itemName] = fromStorage;
    }
  });
}
export { emptyState, select_options, initApp };