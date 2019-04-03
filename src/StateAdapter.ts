import m from 'moment';
import { IState } from './defaults';

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