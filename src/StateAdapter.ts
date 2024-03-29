// @ts-nocheck

import { IState } from './defaults';
import { dateConverter as dC } from '././helpers';

class StateAdapter {
  standardsResult: any;

  constructor(state: IState) {
    Object.assign(this, state);
  }

  getNADForTitle() {
    const stageMap = {
      '0. Sample to be prepared': 'sentOn',
      '1. Sample Sent': 'receivedOn',
      '2. Sample Arrived': 'proformaReceivedDate',
      '3. PI Issued': 'paymentDate1',
      '4. Payment Done': 'startedOn',
      '5. Testing is started': 'testFinishedOnPlanDate',
      '7. Test-report ready': 'certReceivedOnPlanDate',
      '00. Paused': '',
      '01. Canceled': '',
      '02. Estimate': '',
      '6. Pre-treatment done': '',
      '8. Certificate ready': '',
    };

    if (this.stage === '9. Ended') return '';

    return this[stageMap[this.stage]]
      ? ` | NAD - ${dC(this[stageMap[this.stage]], 'DD.MM.YYYY')}`
      : ' | No date';
  }

  getStageForTitle = (): string => {
    let stageForTitle: string;
    switch (this.stage) {
      case '00. Paused':
        stageForTitle = `Paused - ${dC(this.pausedUntil, 'DD.MM.YYYY')}`;
        break;
      case '0. Sample to be prepared':
        stageForTitle = `Sample to be prepared - ${dC(
          this.readyOn,
          'DD.MM.YYYY'
        )}`;
        break;
      case '1. Sample Sent':
        stageForTitle = `Sample Sent - ${dC(this.sentOn, 'DD.MM.YYYY')}`;
        break;
      case '2. Sample Arrived':
        stageForTitle = `Sample Arrived - ${dC(this.receivedOn, 'DD.MM.YYYY')}`;
        break;
      case '3. PI Issued':
        stageForTitle = `PI Issued - ${dC(
          this.proformaReceivedDate,
          'DD.MM.YYYY'
        )}`;
        break;
      case '4. Payment Done':
        stageForTitle = `Payment Done - ${dC(this.paymentDate1, 'DD.MM.YYYY')}`;
        break;
      case '5. Testing is started':
        stageForTitle = `Testing is started - ${dC(
          this.startedOn,
          'DD.MM.YYYY'
        )}`;
        break;
      case '6. Pre-treatment done':
        stageForTitle = `Pre-treatment done - ${this.pretreatment1Result.toUpperCase()}`;
        break;
      case '7. Test-report ready':
        stageForTitle = `Test-report ready - ${dC(
          this.testFinishedOnRealDate,
          'DD.MM.YYYY'
        )}`;
        break;
      case '8. Certificate ready':
        stageForTitle = `Certificate ready - ${dC(
          this.certReceivedOnRealDate,
          'DD.MM.YYYY'
        )}`;
        break;
      case '9. Ended':
        stageForTitle = this.certificate;
        break;
      default:
        stageForTitle = this.stage.substring(this.stage.indexOf(' ') + 1);
    }
    return stageForTitle;
  };

  get standardsWithResults(): string {
    let standards: string = '';

    // add standards with results
    for (const [st, res] of Object.entries(this.standardsResult)) {
      standards += `${st} (${res}), `;
    }
    // add standards without results
    for (let st of this.standards.split(', ')) {
      if (!Object.keys(this.standardsResult).includes(st)) {
        standards += `${st}, `;
      }
    }

    standards = standards.slice(0, -2);
    return standards;
  }

  set standardsWithResults(e) {}

  get testFinishedOn() {
    return (
      `${this.testFinishedOnPlanDate && this.testFinishedOnPlanDate + ', '}` +
      `${this.testFinishedOnRealDate && this.testFinishedOnRealDate + ', '}`
    ).slice(0, -2);
  }

  get certReceivedOn() {
    return (
      `${this.certReceivedOnPlanDate && this.certReceivedOnPlanDate + ', '}` +
      `${this.certReceivedOnRealDate && this.certReceivedOnRealDate + ', '}`
    ).slice(0, -2);
  }
}

export { StateAdapter };
