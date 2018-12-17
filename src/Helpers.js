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

export { parseSelectable, parseDates };