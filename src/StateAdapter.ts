import m from 'moment';
import { IState } from './defaults';
import { dateConverter as dC } from '././helpers';

m.fn.toJSON = function() { return this.format(); }

interface IStateAdapter {
  formatDate: (date : string | null) => string;
}

class StateAdapter implements IStateAdapter {
  constructor(state : IState) {
     Object.assign(this, state);
  }

  formatDate(date: string | null) {
    return date ? m(date).format("DDMMMYYYY") : '';
  }

  getStageForTitle = (): string => {
    let stageForTitle: string;
    // @ts-ignore
    switch (this.stage) {
      case '0. Sample to be prepared':
      // @ts-ignore
        stageForTitle = `Sample to be prepared - ${dC(this.readyOn, 'DD.MM.YYYY')}`
        break;
      case '1. Sample Sent':
      // @ts-ignore
        stageForTitle = `Sample Sent - ${dC(this.sentOn, 'DD.MM.YYYY')}`
        break;
      case '2. Sample Arrived':
      // @ts-ignore
        stageForTitle = `Sample Arrived - ${dC(this.receivedOn, 'DD.MM.YYYY')}`
        break;
      case '3. PI Issued':
      // @ts-ignore
        stageForTitle = `PI Issued - ${dC(this.proformaReceivedDate, 'DD.MM.YYYY')}`
        break;
      case '4. Payment Done':
      // @ts-ignore
        stageForTitle = `Payment Done - ${dC(this.paymentDate, 'DD.MM.YYYY')}`
        break;
      case '5. Testing is started':
      // @ts-ignore
        stageForTitle = `Testing is started - ${dC(this.startedOn, 'DD.MM.YYYY')}`
        break;
      case '6. Pre-treatment done':
      // @ts-ignore
        stageForTitle = `Pre-treatment done - ${this.pretreatment1Result.toUpperCase()}`
        break;
      case '7. Test-report ready':
      // @ts-ignore
        stageForTitle = `Test-report ready - ${dC(this.testFinishedOnPlanDate, 'DD.MM.YYYY')}`
        break;
      case '8. Certificate ready':
      // @ts-ignore
        stageForTitle = `Certificate ready - ${dC(this.certReceivedOnPlanDate, 'DD.MM.YYYY')}`
        break;
      default:
        stageForTitle = '';
    }
    return stageForTitle;
  }

  get secondPayment() {
    // @ts-ignore
    return (`${this.price2 ? this.price2 + ' €, ' : ''}` +
      //@ts-ignore
      `${this.paymentDate2 ? this.formatDate(this.paymentDate2) + ', ' : ''}` +
      //@ts-ignore
      `${this.proformaReceivedDate2 ? this.formatDate(this.proformaReceivedDate2) + ', ' : ''}` +
      //@ts-ignore
      `${this.proformaNumber2 ? this.proformaNumber2 + ', ' : ''}`).slice(0, -2);
  }

  get testFinishedOn() {
    //@ts-ignore
    return (`${this.testFinishedOnPlanDate ? this.formatDate(this.testFinishedOnPlanDate) + ', ' : ''}` +
      //@ts-ignore
      `${this.testFinishedOnRealDate ? this.formatDate(this.testFinishedOnRealDate) + ', ': ''}`).slice(0, -2);
  }

  get certReceivedOn() {
    //@ts-ignore
    return (`${this.certReceivedOnPlanDate ? this.formatDate(this.certReceivedOnPlanDate) + ', ' : ''}` +
      //@ts-ignore
      `${this.certReceivedOnRealDate ? this.formatDate(this.certReceivedOnRealDate) + ', ' : ''}`).slice(0, -2);
  }
}

export default StateAdapter;