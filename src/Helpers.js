import m from 'moment';
import { select_options } from './Form';
import { strict } from 'assert';


const parseDates = data => ({
  sentOn: m(data.sentOn, 'DDMMMYYYY'),
  receivedOn: m(data.receivedOn, 'DDMMMYYYY'),
  startedOn: m(data.startedOn, 'DDMMMYYYY'),
  finishedOn: m(data.finishedOn, 'DDMMMYYYY'),
  resultsReceived: m(data.resultsReceived, 'DDMMMYYYY')
});

const convertToSelectable = (prop_name, selectee) => {
  const selected = [];
  if (selectee !== '') {
    selectee.split(',').forEach(value => {
      value = value.trim();
      selected.push({
        value,
        label: select_options[prop_name].find(el => el.value === value).label,
      });
    });
  }
  return selected;
}

const dataSeparator = '-------------------------------------------------';

let parseable_description = desc => (desc.startsWith(dataSeparator)) ? true : false;

let parseDescription = desc => {
  let taskState;
  let otherTextInDescription;

  desc = desc.slice(dataSeparator.length); //удалили открывающий сепаратор
  let end = desc.indexOf(dataSeparator); // нашли начало закрывающего сепаратора
  taskState = desc.slice(0, end).trim();
  otherTextInDescription = desc.slice(end + dataSeparator.length);

  return [taskState, otherTextInDescription];
};

function parse(description, uf_crm_task) {
  if (!parseable_description) {
    return null;
  }

  let [unParsedTaskState, otherTextInDescription] = parseDescription(description);

  const newState = {};

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

  unParsedTaskState = unParsedTaskState
    .replace(/\[\/B\]/gi, ':prop_value_separator:')
    .replace(/\[B\]|/gi, '')
    .split('\n');

  unParsedTaskState.forEach(prop => {
    const [prop_name, prop_value] = prop.split('::prop_value_separator:');
    newState[prop_map[prop_name]] = prop_value.trim();
  });

  newState.standard = convertToSelectable('standard', newState.standard);
  newState.testingCompany = convertToSelectable('testingCompany', newState.testingCompany);
  newState.brand = convertToSelectable('brand', uf_crm_task.filter(v => v !== 'CO_6295').join(','));
  newState.otherTextInDescription = otherTextInDescription;

  return Object.assign(newState, { ...parseDates(newState) });
};

export default parse;
export { convertToSelectable, dataSeparator };