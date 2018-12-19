import m from 'moment';

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
      const standard = value.trim();
      selected.push({
        value: standard,
        label: standard,
        id: prop_name
      });
    });
  }
  return selected;
}

function parse(description) {
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
    'ISO': 'iso',
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

  newState.iso_orig = newState.iso;
  newState.testingCompany_orig = newState.testingCompany;
  newState.iso = parseSelectable('iso', newState.iso)
  newState.testingCompany = parseSelectable('iso', newState.testingCompany)

  return Object.assign(newState, { ...parseDates(newState) });
};

export default parse;