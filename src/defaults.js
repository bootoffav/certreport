import B24 from './B24';

let select_options = {
  brand: [
    {value: 'C_10033', label: 'XMT'},
    {value: 'C_10035', label: 'XMF'},
    {value: 'C_10037', label: 'XMS'},
    {value: 'C_10041', label: 'XMG'}
  ],
  standard: [
    {value: 'ISO 17893', label: 'ISO 17893'},
    {value: 'EN 11611', label: 'EN 11611'},
    {value: 'EN 11612', label: 'EN 11612'},
    {value: 'EN 1149-3', label: 'ISO 1149-3'},
    {value: 'EN 20471', label: 'EN 20471'}
  ],
  testingCompany: [
    {value: 'Aitex Headquarters (Spain)', label: 'Aitex Headquarters (Spain)'},
    {value: 'AITEX SHANGHAI OFFICE', label: 'AITEX SHANGHAI OFFICE'}
  ],
  created: new Date(),
  article: []
};

const empty_state = {
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
  standard: [],
  testingCompany: [],
  brand: [],
  sentOn: '',
  receivedOn: '',
  startedOn: '',
  finishedOn: '',
  resultsReceived: '',
  price: ''
};

function initApp() {
  let articleFromStorage = JSON.parse(localStorage.getItem('article'));
  
  if (articleFromStorage) {
    select_options.article = articleFromStorage;
    return;
  }

  B24.get_products()
    .then(products => {
      localStorage.setItem('article', JSON.stringify(products));
      select_options.article = products;
    });

}
export { empty_state, select_options, initApp };