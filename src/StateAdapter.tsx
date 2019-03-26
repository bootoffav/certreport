import m from 'moment';
import { IState } from './defaults';

m.fn.toJSON = function() { return this.format(); }

class StateAdapter {
  st : IState;
  constructor(st : IState) {
    this.st = { ...st };
  }

  formatDate = (date : any) => date ? m(date).format("DDMMMYYYY") : '';

  get secondPayment() {
    return (`${this.st.price2 ? this.st.price2 + ' €, ' : ''}` +
           `${this.st.paymentDate2 ? this.formatDate(this.st.paymentDate2) + ', ' : ''}` +
           `${this.st.proformaReceivedDate2 ? this.formatDate(this.st.proformaReceivedDate2) + ', ' : ''}` +
           `${this.st.proformaNumber2 ? this.st.proformaNumber2 + ', ' : ''}`).slice(0, -2);
  }
}

export default StateAdapter;