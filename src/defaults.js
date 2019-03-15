import B24 from './B24';

let select_options = {
  brand: [
    {value: 'C_10033', label: 'XMT'},
    {value: 'C_10035', label: 'XMF'},
    {value: 'C_10037', label: 'XMS'},
    {value: 'C_10041', label: 'XMG'}
  ],
  standards: [],
  testingCompany: [
    {value: 'Aitex Headquarters (Spain)', label: 'Aitex Headquarters (Spain)'},
    {value: 'AITEX SHANGHAI OFFICE', label: 'AITEX SHANGHAI OFFICE'},
    {value: 'SATRA (UK)', label: 'SATRA (UK)'}
  ],
  created: new Date(),
  articles: []
};

const emptyState = {
  length: 1,
  testingTime: 21,
  width: 1.5,
  proformaReceivedDate: null,
  proformaReceivedDate2: null,
  sentOn: null,
  receivedOn: null,
  startedOn: null,
  finishedOn: null,
  resultsReceived: null,
  paymentDate: null,
  paymentDate2: null,
  proformaReceived: false,
  proformaReceived2: false,
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
  pretreatment2: '',
  pretreatment3: '',
};

function initApp() {
  let fromStorage;
  let saveAndApply = (data, itemName) => {
    localStorage.setItem(itemName, JSON.stringify(data));
    select_options[itemName] = data;
  }

  B24.get_products().then(data => saveAndApply(data, 'articles'));
  B24.get_standards().then(data => saveAndApply(data, 'standards'));

  ['articles', 'standards'].forEach(itemName => {
    fromStorage = JSON.parse(localStorage.getItem(itemName));
    if (fromStorage) {
      select_options[itemName] = fromStorage;
    }
  });
}
export { emptyState, select_options, initApp };