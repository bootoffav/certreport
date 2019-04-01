import m from 'moment';
import { select_options, emptyState, IState } from './defaults';

interface ITask {
  state: {}
  position?: number;
  determineStage: () => Stage;
}

const dataSeparator : string = '-------------------------------------------------';

export enum Stage {
  'Preparing Sample',
  'Sample Sent',
  'Sample Arrived',
  'PI Issued',
  'Payment Done',
  'Tests are In Progress',
  'Results Ready'
}

class Task implements ITask {
  state: IState;
  position?: number;
  stage: Stage;

  constructor(props : any) {
    Object.assign(this, props);
    this.state = this.parse(props.DESCRIPTION, props.UF_CRM_TASK);
    this.stage = this.determineStage();
  }

  parseable_description = (desc : string) => desc.startsWith('[B]Applicant name:[/B]') ? true : false;

  parseDescription = (desc : string) => {
    let taskState;
    let otherTextInDescription;

    let end = desc.indexOf(dataSeparator); // нашли начало закрывающего сепаратора
    taskState = desc.slice(0, end).trim();
    otherTextInDescription = desc.slice(end + dataSeparator.length);

    return [taskState, otherTextInDescription];
};

  parse(description : string, uf_crm_task : []) {
    if (!this.parseable_description(description)) {
      return {
        ...emptyState,
        otherTextInDescription: description,
        UF_CRM_TASK: uf_crm_task
      };
    }

    let [unParsedTaskState, otherTextInDescription] = this.parseDescription(description);

    const newState : {
      [key: string]: any;
    } = {};

    const prop_map : {
      [key: string]: string;
    } = {
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
      'Sample ready on': 'readyOn',
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

    let matched = unParsedTaskState.match(/\[B\].+\[\/B\]/gm);
    const props = matched ? matched.map(prop => prop.slice(3, -4)) : [];


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

    newState.price = newState.price ? newState.price.split(' ')[0] : '';
    newState.paid = newState.paymentDate ? true : false;

    if (newState.secondPayment) {
      [
        newState.price2,
        newState.paymentDate2,
        newState.proformaReceivedDate2,
        newState.proformaNumber2
      ] = newState.secondPayment.split(', ');

      newState.price2 = newState.price2 ? newState.price2.split(' ')[0] : '';
      
      newState.paymentDate2 = newState.paymentDate2 || '';
      newState.paid2 = newState.paymentDate2 ? true : false;
      
      newState.proformaReceivedDate2 = newState.proformaReceivedDate2 || '';
      newState.proformaNumber2 = newState.proformaNumber2 || '';
      newState.proformaReceived2 = newState.proformaReceivedDate2 ? true : false;
      
      delete newState.secondPayment;
    }
    
    newState.brand = uf_crm_task.filter((v : any) => ['C_10033', 'C_10035', 'C_10037', 'C_10041'].includes(v)).join();
    newState.brand = select_options.brand.find(el => el.value === newState.brand).label;
    newState.otherTextInDescription = otherTextInDescription;
    newState.UF_CRM_TASK = uf_crm_task;

    return { ...emptyState, ...newState };
};

  determineStage() : Stage {
    if (this.state.readyOn && !this.state.sentOn) return Stage['Preparing Sample'];
    if (this.state.sentOn && !this.state.receivedOn) return Stage['Sample Sent'];
    if (this.state.receivedOn && !this.state.proformaReceived) return Stage['Sample Arrived'];
    if (this.state.proformaReceived && !this.state.paid) return Stage['PI Issued'];
    if (this.state.paid && !this.state.finishedOn) return Stage['Payment Done'];
    if (this.state.finishedOn && !this.state.resultsReceived) return Stage['Tests are In Progress'];
    if (this.state.resultsReceived) return Stage['Results Ready'];
    
    return Stage['Preparing Sample']; //default clause if no other case triggered;
  }
}

export { dataSeparator, Task as default };