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

const empty_state = {
  proformaReceived: false,
  proformaNumber: '',
  proformaReceivedDate: null,
  applicantName: '',
  product: '',
  code: '',
  article: '',
  colour: '',
  length: 1,
  width: 1.5,
  partNumber: '',
  rollNumber: '',
  serialNumber: '',
  materialNeeded: '',
  testingTime: 21,
  standards: '',
  testingCompany: '',
  brand: '',
  sentOn: null,
  receivedOn: null,
  startedOn: null,
  finishedOn: null,
  resultsReceived: null,
  price: '',
  comments: '',
  testReport: '',
  certificate: '',
  paymentDate: null,
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
export { empty_state, select_options, initApp };