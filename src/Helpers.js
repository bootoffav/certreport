import m from 'moment';

const select_options = {
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
    {value: 'EN 1149-3', label: 'ISO 1149-3'}
  ],
  testingCompany: [
    {value: 'Aitex Headquarters (Spain)', label: 'Aitex Headquarters (Spain)'},
    {value: 'AITEX SHANGHAI OFFICE', label: 'AITEX SHANGHAI OFFICE'}
  ]
};

const parseDates = data => ({
  sentOn: m(data.sentOn, 'DDMMMYYYY'),
  receivedOn: m(data.receivedOn, 'DDMMMYYYY'),
  startedOn: m(data.startedOn, 'DDMMMYYYY'),
  finishedOn: m(data.finishedOn, 'DDMMMYYYY'),
  resultsReceived: m(data.resultsReceived, 'DDMMMYYYY')
});

const parseSelectable = (prop_name, selectee) => {
  const selected = [];
  if (selectee !== '') {
    selectee.split(',').forEach(value => {
      value = value.trim();
      selected.push({
        value,
        // label: value,
        label: select_options[prop_name].find(el => el.value === value).label,
      });
    });
  }
  return selected;
}

function parse(description, uf_crm_task) {
  if (description.indexOf(':[/B]') === -1) {
      return null; // is not valid for parsing
  }
  const prop_map = {
    'Applicant name': 'applicantName',
    'Product': 'product',
    'Code': 'code',
    'Article': 'article',
    'Colour': 'colour',
    'Serial number': 'serialNumber',
    'Length of sample, meters': 'length',
    'Width of sample, meters': 'width',
    'Part number': 'partNumber',
    'Roll number': 'rollNumber',
    'Standard': 'standard',
    'Testing company': 'testingCompany',
    'Material needed': 'materialNeeded',
    'Testing time, days': 'testingTime',
    'to be sent on': 'sentOn',
    'to be received on': 'receivedOn',
    'tests to be started on': 'startedOn',
    'tests to be finished on': 'finishedOn',
    'results to be received on': 'resultsReceived'
  }
  const newState = {};

  description = description
    .replace(/\[\/B\]/gi, ':prop_value_separator:')
    .replace(/\[B\]|/gi, '')
    .split('\n');

  description.forEach(prop => {
    const [prop_name, prop_value] = prop.split('::prop_value_separator:');
    newState[prop_map[prop_name]] = prop_value.trim();
  });

  newState.standard_orig = newState.standard;
  newState.testingCompany_orig = newState.testingCompany;
  
  newState.standard = parseSelectable('standard', newState.standard);
  newState.testingCompany = parseSelectable('testingCompany', newState.testingCompany);
  newState.brand = parseSelectable('brand', uf_crm_task.filter(v => v !== 'CO_6295').join(','));

  return Object.assign(newState, { ...parseDates(newState) });
};

export default parse;
export { select_options };