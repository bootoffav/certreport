import m from 'moment';

m.fn.toJSON = function() { return this.format(); }



class StateAdapter {
  constructor(state) {
    Object.assign(this, state);
  }

  formatDate = date => date ? m(date).format("DDMMMYYYY") : '';

  get secondPayment() {
    return (`${this.price2 ? this.price2 + ' €, ' : ''}` +
           `${this.paymentDate2 ? this.formatDate(this.paymentDate2) + ', ' : ''}` +
           `${this.proformaReceivedDate2 ? this.formatDate(this.proformaReceivedDate2) + ', ' : ''}` +
           `${this.proformaNumber2 ? this.proformaNumber2 + ', ' : ''}`).slice(0, -2);
  }
}

export default StateAdapter;