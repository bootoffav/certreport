import m from 'moment';
import { select_options } from './components/Form/Form';
import { emptyState } from './defaults';

m.fn.toJSON = function() { return this.format(); }

const parseDates = (d, format = 'DDMMMYYYY') => ({
    sentOn: d.sentOn ? m(d.sentOn, format) : d.sentOn,
    receivedOn: d.receivedOn ? m(d.receivedOn, format) : d.receivedOn,
    startedOn: d.startedOn ? m(d.startedOn, format) : d.startedOn,
    finishedOn: d.finishedOn ? m(d.finishedOn, format) : d.finishedOn,
    resultsReceived: d.resultsReceived ? m(d.resultsReceived, format) : d.resultsReceived,
    paymentDate: d.paymentDate ? m(d.paymentDate, format) : d.paymentDate
});

const dataSeparator = '-------------------------------------------------';

let parseable_description = desc => desc.startsWith('[B]Applicant name:[/B]') ? true : false;

let parseDescription = desc => {
  let taskState;
  let otherTextInDescription;

  let end = desc.indexOf(dataSeparator); // нашли начало закрывающего сепаратора
  taskState = desc.slice(0, end).trim();
  otherTextInDescription = desc.slice(end + dataSeparator.length);

  return [taskState, otherTextInDescription];
};

function parse(description, uf_crm_task) {
  if (!parseable_description(description)) {
    return {
      ...emptyState,
      otherTextInDescription: description,
      UF_CRM_TASK: uf_crm_task
    };
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
    'Standard': 'standards',
    'Test report': 'testReport',
    'Certificate': 'certificate',
    'Price': 'price',
    'Payment date': 'paymentDate',
    'Proforma': 'proforma',
    'Testing company': 'testingCompany',
    'Material needed': 'materialNeeded',
    'Testing time, days': 'testingTime',
    'Pre-treatment 1' : 'pretreatment1',
    'Pre-treatment 2' : 'pretreatment2',
    'Pre-treatment 3' : 'pretreatment3',
    'to be sent on': 'sentOn',
    'to be received on': 'receivedOn',
    'tests to be started on': 'startedOn',
    'tests to be finished on': 'finishedOn',
    'results to be received on': 'resultsReceived',
    'Comments': 'comments',
    'Edit': 'link',
    'Second payment': 'secondPayment'
  }

  unParsedTaskState = unParsedTaskState.replace(/:/g, '');

  const props = unParsedTaskState.match(/\[B\].+\[\/B\]/gm)
                  .map(prop => prop.slice(3, -4));
  const vals = unParsedTaskState.split(/\[B\].+\[\/B\]/g)
                .map(item => item.trim())
                .slice(1);

  for (let i = 0; i < props.length; i++) {
    newState[prop_map[props[i]]] = vals[i];
  }

  if (newState.proforma) {
    [ newState.proformaReceivedDate, newState.proformaNumber ] = newState.proforma.split(', ');
    newState.proformaReceived = true;
    delete newState.proforma;
  }

  newState.price = newState.price ? newState.price.split(' ')[0] : newState.price;
  newState.paid = newState.paymentDate ? true : false;

  if (newState.secondPayment) {
    [
      newState.price2,
      newState.paymentDate2,
      newState.proformaReceivedDate2,
      newState.proformaNumber2
    ] = newState.secondPayment.split(', ');
    newState.price2 = newState.price2.split(' ')[0];
    newState.paid2 = newState.paymentDate2 ? true : false;
    newState.proformaReceived2 = true;
    delete newState.secondPayment;
  }
  
  newState.brand = uf_crm_task.filter(v => ['C_10033', 'C_10035', 'C_10037', 'C_10041'].includes(v)).join();
  newState.brand = select_options.brand.find(el => el.value === newState.brand).label;
  newState.otherTextInDescription = otherTextInDescription;
  newState.UF_CRM_TASK = uf_crm_task;

  return Object.assign(newState, { ...parseDates(newState) });
};

export default parse;
export { dataSeparator, parseDates };