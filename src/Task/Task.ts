import dayjs from 'dayjs';
import { emptyState, brand } from './emptyState';

const dataSeparator = '-------------------------------------------------';

const taskPropMapAliases: {
  [key: string]: string;
} = {
  pretreatment1: 'Wash_1',
};

function getTaskParamLabel(param: string) {
  return (
    taskPropMapAliases[param] ??
    (Object.keys(taskPropMap).find((key) => taskPropMap[key] === param) ||
      'Price') // because deleted
  );
}

const taskPropMap: {
  [k: string]: any;
} = {
  'Applicant name': 'applicantName',
  Product: 'product',
  Code: 'code',
  Article: 'article',
  Colour: 'colour',
  'Serial number': 'serialNumber',
  'Length of sample, meters': 'length',
  'Width of sample, meters': 'width',
  'Part number': 'partNumber',
  'Roll number': 'rollNumber',
  Standard: 'standards',
  'Test report': 'testReport',
  Certificate: 'certificate',
  Price: 'price1',
  'Payment date': 'paymentDate1',
  'Testing company': 'testingCompany',
  'Material needed': 'materialNeeded',
  'Testing time, days': 'testingTime',
  'Pre-treatment 1': 'pretreatment1',
  'Pre-treatment 2': 'pretreatment2',
  'Pre-treatment 3': 'pretreatment3',
  'Paused Until': 'pausedUntil',
  'Sample ready on': 'readyOn',
  'to be sent on': 'sentOn',
  'to be received on': 'receivedOn',
  'tests to be started on': 'startedOn',
  'tests to be finished on': 'testFinishedOn',
  'results to be received on': 'certReceivedOn',
  Resume: 'resume',
  Stage: 'stage',
  News: 'news',
  Comments: 'comments',
  Edit: 'link',
  'Second payment': 'secondPayment',
};

class Task {
  state: any;
  position?: number;
  overdue: boolean;
  lastActionDate: string | undefined;
  nextActionDate: string;

  constructor(props: { description: string; ufCrmTask: string[] }) {
    Object.assign(this, props);
    this.state = this.parse(props.description, props.ufCrmTask);
    this.state.stage = this.state.stage || this.determineStage();
    [this.overdue, this.lastActionDate] = this.determineOverdue();
    this.nextActionDate = this.getNextActionDate();
  }

  static parseable_description = (desc: string) =>
    desc.startsWith('[B]Applicant name:[/B]');

  static separateParseableDataAndOtherTextOfDescription = (desc: string) => ({
    unParsedTaskState: desc.slice(0, desc.indexOf(dataSeparator)).trim(),
    otherTextInDescription: desc
      .slice(desc.indexOf(dataSeparator) + dataSeparator.length)
      .trim(),
  });

  parse(description: string, ufCrmTask: string[]) {
    if (!Task.parseable_description(description)) {
      return {
        ...emptyState,
        otherTextInDescription: description,
        ufCrmTask,
      };
    }

    let { unParsedTaskState, otherTextInDescription } =
      Task.separateParseableDataAndOtherTextOfDescription(description);

    let parsedState: {
      [k: string]: any;
    } = { ...emptyState };

    unParsedTaskState = unParsedTaskState.replace(/:/g, '');

    let matched: string[] = unParsedTaskState.match(/\[B\].+\[\/B\]/gm) || [];
    const props: string[] = matched.map((prop) => prop.slice(3, -4)) || [];

    const vals = unParsedTaskState
      .split(/\[B\].+\[\/B\]/g)
      .map((item) => item.trim())
      .slice(1);

    for (let i = 0; i < props.length; i++) {
      const prop = taskPropMap[props[i]];
      if (prop === undefined) continue; // case when something in task description should not be parseable
      parsedState[prop] = vals[i];
    }

    if (parsedState.standards) {
      [parsedState.standards, parsedState.standardsResult] =
        this.parseStandardResults(parsedState.standards.split(', '));
    }

    parsedState.price1 = parsedState.price1
      ? parsedState.price1.split(' ')[0]
      : '';
    parsedState.paid = parsedState.paymentDate1 ? true : false;

    if (parsedState.secondPayment) {
      const [price2, paymentDate2, proformaReceivedDate2, proformaNumber2] =
        parsedState.secondPayment.split(', ');

      parsedState.price2 = price2 ? price2.split(' ')[0] : '';
      parsedState.paymentDate2 = paymentDate2 || '';
      parsedState.paid2 = Boolean(paymentDate2);
      parsedState.proformaReceivedDate2 = proformaReceivedDate2 || '';

      try {
        parsedState.proformaNumber2 =
          proformaNumber2 +
            parsedState.secondPayment.substr(
              parsedState.secondPayment.indexOf(proformaNumber2) +
                proformaNumber2.length
            ) || '';
      } catch {
        parsedState.proformaNumber2 = '';
      }

      parsedState.proformaReceived2 = Boolean(proformaReceivedDate2);

      delete parsedState.secondPayment;
    }

    if (parsedState.news) {
      if (parsedState.news.startsWith('https//'))
        parsedState.news = parsedState.news.substring(7);
    }

    if (parsedState.pretreatment1) {
      [parsedState.pretreatment1, parsedState.pretreatment1Result = ''] =
        this.parsePretreatment1(parsedState.pretreatment1);
    }

    if (parsedState.testFinishedOn) {
      [
        parsedState.testFinishedOnPlanDate,
        parsedState.testFinishedOnRealDate = '',
      ] = parsedState.testFinishedOn.split(', ');
      delete parsedState.testFinishedOn;
    }

    if (parsedState.certReceivedOn) {
      [
        parsedState.certReceivedOnPlanDate,
        parsedState.certReceivedOnRealDate = '',
      ] = parsedState.certReceivedOn.split(', ');
      delete parsedState.certReceivedOn;
    }

    parsedState.brand = ufCrmTask
      .filter((v: any) =>
        ['C_10033', 'C_10035', 'C_10037', 'C_10041'].includes(v)
      )
      .join();
    // @ts-ignore
    parsedState.brand = brand.find(
      (el) => el.value === parsedState.brand
    ).label;
    parsedState.otherTextInDescription = otherTextInDescription;
    parsedState.ufCrmTask = ufCrmTask;

    return parsedState;
  }

  /**
   * Create object for managing Standard results, cleans up standards from pass/fail
   * @param standards Array of standards as strings
   * @returns [ standards for state, object with Standard Results]
   */
  parseStandardResults(standards: string[]): [string, {}] {
    let standardsResults: {
      [k: string]: string;
    } = {};
    let parsedStandards = '';

    for (let st of standards) {
      const reqRes = /pass|fail|partly/.exec(st);
      if (reqRes !== null) {
        const prop = reqRes.input.slice(0, reqRes.index - 2);
        const value = reqRes[0];
        standardsResults[prop] = value;
        parsedStandards += `${prop}, `;
      } else {
        parsedStandards += `${st}, `;
      }
    }

    return [parsedStandards.slice(0, -2), standardsResults];
  }

  /**
   * @param string for parsing
   * @returns array, el[0] is value of pretreatment, el[1] is result
   */
  parsePretreatment1(pretreatment1Result: string): string[] {
    const result = /\(pass\)|\(fail\)$/.exec(pretreatment1Result);
    return result
      ? [pretreatment1Result.slice(0, -7), result[0].slice(1, -1)]
      : [pretreatment1Result, ''];
  }

  determineStage(): string {
    if (this.state.readyOn && !this.state.sentOn)
      return '0. Sample to be prepared';
    if (this.state.sentOn && !this.state.receivedOn) return '1. Sample Sent';
    if (!this.state.proformaReceived && !this.state.paid && this.state.resume)
      return '8. Certificate ready';
    if (
      this.state.receivedOn &&
      !this.state.proformaReceived &&
      !this.state.startedOn
    )
      return '2. Sample Arrived';
    if (this.state.proformaReceived && !this.state.paid) return '3. PI Issued';
    if (this.state.paid && !this.state.testFinishedOnPlanDate)
      return '4. Payment Done';
    if (this.state.testFinishedOnPlanDate && !this.state.testFinishedOnRealDate)
      return '5. Testing is started';
    if (this.state.testFinishedOnRealDate && !this.state.certReceivedOnRealDate)
      return '6. Test-report ready';
    if (this.state.certReceivedOnRealDate) return '8. Certificate ready';

    return '0. Sample to be prepared';
  }

  getNextActionDate() {
    switch (this.state.stage) {
      case '0. Sample to be prepared':
        return this.state['sentOn'] || 'No date';
      case '1. Sample Sent':
        return this.state['receivedOn'] || 'No date';
      case '2. Sample Arrived':
        return this.state['proformaReceivedDate'] || 'No date';
      case '3. PI Issued':
        return this.state['paymentDate1'] || 'No date';
      case '4. Payment Done':
        return this.state['startedOn'] || 'No date';
      case '5. Testing is started':
        return this.state['testFinishedOnPlanDate'] || 'No date';
      case '7. Test-report ready':
        return this.state['certReceivedOnPlanDate'] || 'No date';
      case '8. Certificate ready':
        return '-' || 'No date';
    }

    return 'No Date';
  }

  determineOverdue(): [boolean, string | undefined] {
    const today = dayjs();
    switch (this.state.stage) {
      case '0. Sample to be prepared':
        return [
          dayjs(this.state['readyOn']).add(2, 'day') < today,
          this.state['readyOn'],
        ];
      case '1. Sample Sent':
        return [
          dayjs(this.state['sentOn']).add(7, 'day') < today,
          this.state['sentOn'],
        ];
      case '2. Sample Arrived':
        return [
          dayjs(this.state['receivedOn']).add(2, 'day') < today,
          this.state['receivedOn'],
        ];
      case '3. PI Issued':
        return [
          dayjs(this.state['proformaReceivedDate']).add(2, 'day') < today,
          this.state['proformaReceivedDate'],
        ];
      case '4. Payment Done':
        return [
          dayjs(this.state['paymentDate1']).add(2, 'day') < today,
          this.state['paymentDate1'],
        ];
      case '5. Testing is started':
        return [
          dayjs(this.state['testFinishedOnPlanDate']) < today,
          this.state['startedOn'],
        ];
      case '7. Test-report ready':
        if (this.state['certReceivedOnPlanDate']) {
          return [
            dayjs(this.state['certReceivedOnPlanDate']).add(1, 'day') < today,
            this.state['testFinishedOnRealDate'],
          ];
        }
        return [
          dayjs(this.state['testFinishedOnPlanDate']).add(2, 'day') < today,
          this.state['testFinishedOnPlanDate'],
        ];
      case '8. Certificate ready':
        return this.state['certReceivedOnRealDate']
          ? [false, this.state['certReceivedOnRealDate']]
          : [
              dayjs(this.state['certReceivedOnPlanDate']).add(1, 'day') < today,
              this.state['certReceivedOnPlanDate'],
            ];
      case '9. Ended':
        return [
          false,
          this.state.certReceivedOnRealDate ||
            this.state.testFinishedOnRealDate ||
            'No Date',
        ];
    }
    return [false, undefined];
  }
}

export { dataSeparator, Task, taskPropMap, getTaskParamLabel };
