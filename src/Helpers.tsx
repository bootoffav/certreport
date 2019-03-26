import m from 'moment';

m.fn.toJSON = function() { return this.format(); }

export function parseDates(d : any, format = 'DDMMMYYYY') {
  return {
    sentOn: d.sentOn ? m(d.sentOn, format) : d.sentOn,
    receivedOn: d.receivedOn ? m(d.receivedOn, format) : d.receivedOn,
    startedOn: d.startedOn ? m(d.startedOn, format) : d.startedOn,
    finishedOn: d.finishedOn ? m(d.finishedOn, format) : d.finishedOn,
    resultsReceived: d.resultsReceived ? m(d.resultsReceived, format) : d.resultsReceived,
    paymentDate: d.paymentDate ? m(d.paymentDate, format) : d.paymentDate
  }
}

export const dataSeparator = '-------------------------------------------------';
