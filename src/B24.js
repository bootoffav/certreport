import qs from 'qs';
import m from 'moment';
import parse, { dataSeparator } from './Helpers';
import { generatePDF } from './components/Export/Export';
import Task from './Task';

m.fn.toJSON = function() { return this.format(); }
const creator_id = process.env.REACT_APP_B24_USER_ID;
const webhook_key = process.env.REACT_APP_B24_WEBHOOK_KEY;
const main_url = process.env.REACT_APP_B24_MAIN_URL;
const auditors = process.env.REACT_APP_B24_AUDITORS.split(',');


class B24 {
    static defaultParams = {
        CREATED_BY: creator_id,
        TAGS: ['certification'],
        GROUP_ID: 21,
    }

    static get start() {
      return this._start;
    }

    static set start(start) {
      this._start = start;
    }

    static step = json => {
      B24.start = json.next;
      return json.result;
    };

    static makeUfCrmTaskField = state => {
      const brands_map = {
        XMS: 'C_10037',
        XMF: 'C_10035',
        XMT: 'C_10033',
        XMG: 'C_10041'
      };
      let UF_CRM_TASK = [];
      
      if (state.UF_CRM_TASK) {
        state.UF_CRM_TASK.forEach(item => {
          if (![
            'C_10033',
            'C_10035',
            'C_10037',
            'C_10041',
            'CO_6295'
          ].includes(item)
          ) {
            UF_CRM_TASK.push(item);
          }
        });
      }
      
      UF_CRM_TASK.push(brands_map[state.brand], 'CO_6295');
      
      return UF_CRM_TASK;
    }
    
    static formTaskFields = state => {
        return {
        ...B24.defaultParams,
        UF_CRM_TASK: B24.makeUfCrmTaskField(state),
        TITLE: `${state.serialNumber}_${state.testingCompany} - ${state.standards} - ${state.article}, ${state.colour} ` +
            `(send ${state.formatDate(state.sentOn)} - plan ${state.formatDate(state.resultsReceived)}) = ${state.price} € | ${state.testReport ? state.testReport : ''}`,
        DESCRIPTION: `${state.applicantName ? '[B]Applicant name:[/B] ' + state.applicantName + '\n' : ''}` +
            `${state.product ? '[B]Product:[/B] ' + state.product + '\n' : ''}` +
            `${state.code ? '[B]Code:[/B] ' + state.code + '\n' : ''}` +
            `${state.article ? '[B]Article:[/B] ' + state.article + '\n' : ''}` +
            `${state.colour ? '[B]Colour:[/B] ' + state.colour + '\n' : ''}` +
            `${state.serialNumber ? '[B]Serial number:[/B] ' + state.serialNumber + '\n' : ''}` +
            `${state.length ? '[B]Length of sample, meters:[/B] ' + state.length + '\n' : ''}` +
            `${state.width ? '[B]Width of sample, meters:[/B] ' + state.width + '\n' : ''}` +
            `${state.partNumber ? '[B]Part number:[/B] ' + state.partNumber + '\n' : ''}` +
            `${state.rollNumber ? '[B]Roll number:[/B] ' + state.rollNumber + '\n' : ''}` +
            `${state.standards ? '[B]Standard:[/B] ' + state.standards + '\n' : ''}` +
            `${state.price ? '[B]Price:[/B] ' + state.price + ' €\n' : ''}` +
            `${state.secondPayment ? '[B]Second payment:[/B] ' + state.secondPayment + '\n' : ''}` +
            `${state.paymentDate ? '[B]Payment date:[/B] ' + state.formatDate(state.paymentDate) + '\n' : ''}` +
            `${state.testingCompany ? '[B]Testing company:[/B] ' + state.testingCompany + '\n' : ''}` +
            `${state.proformaReceivedDate && state.proformaNumber ? '[B]Proforma:[/B] ' + state.formatDate(state.proformaReceivedDate) + ', ' + state.proformaNumber + '\n' : ''}` +
            `${state.testReport ? '[B]Test report:[/B] ' + state.testReport + '\n' : ''}` +
            `${state.certificate ? '[B]Certificate:[/B] ' + state.certificate + '\n' : ''}` +
            `${state.materialNeeded ? '[B]Material needed:[/B] ' + state.materialNeeded + '\n' : ''}` +
            `${state.testingTime ? '[B]Testing time, days:[/B] ' + state.testingTime + '\n' : ''}` +
            `${state.pretreatment1 ? '[B]Pre-treatment 1:[/B] ' + state.pretreatment1 + '\n' : ''}` +
            `${state.pretreatment2 ? '[B]Pre-treatment 2:[/B] ' + state.pretreatment2 + '\n' : ''}` +
            `${state.pretreatment3 ? '[B]Pre-treatment 3:[/B] ' + state.pretreatment3 + '\n' : ''}` +
            `${state.sentOn ? '[B]to be sent on:[/B] ' + state.formatDate(state.sentOn) + '\n' : ''}` +
            `${state.receivedOn ? '[B]to be received on:[/B] ' + state.formatDate(state.receivedOn) + '\n' : ''}` +
            `${state.startedOn ? '[B]tests to be started on:[/B] ' + state.formatDate(state.startedOn) + '\n' : ''}` +
            `${state.finishedOn ? '[B]tests to be finished on:[/B] ' + state.formatDate(state.finishedOn) + '\n' : ''}` +
            `${state.resultsReceived ? '[B]results to be received on: [/B]' + state.formatDate(state.resultsReceived) + '\n' : ''}` +
            `${state.comments ? '[B]Comments:[/B] ' + state.comments + '\n' : ''}` +
            `${state.link ? '[B]Edit:[/B] ' + state.link + '\n' : ''} ` +
            `${dataSeparator}` + (state.otherTextInDescription || ''),
        DEADLINE: m(state.resultsReceived).toISOString()
      }
    };

    static createTask = state => {
      const defaultParams = {
        AUDITORS: auditors,
        PARENT_ID: 46902,
        RESPONSIBLE_ID: 19
      }

      const attachPDF = taskId => {
        fetch(`${main_url}/${creator_id}/${webhook_key}/task.item.addfile/`, {
          method: 'post',
          body: qs.stringify({
            TASK_ID: taskId,
            FILE: {
              NAME: `${state.serialNumber} - ${state.applicantName}.pdf`,
              CONTENT: btoa(generatePDF(state).output())
            }
          })
        })
      }

      const taskData = { ...B24.formTaskFields(state), ...defaultParams };
      return fetch(`${main_url}/${creator_id}/${webhook_key}/task.item.add/`, {
        method: 'post',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: qs.stringify([ taskData ])
      })
        .then(r => r.json())
        .then(response => {
          attachPDF(response.result);
          state.link = `[URL=https://certreport.xmtextiles.com/edit/${response.result}/]this task[/URL]`;
          B24.updateTask(state, response.result); //to include link for editing
        });
    }

    static updateTask(state, task_id = null) {
        if (task_id === null) {
            throw new Error('task id is not defined');
        }
        const task_data = B24.formTaskFields(state);
        return fetch(`${main_url}/${creator_id}/${webhook_key}/task.item.update/`, {
          method: 'post',
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
          body: qs.stringify([task_id, task_data])
        });
    }

    static async get_tasks() {
      let tasks = [];
      do {
        tasks = tasks.concat(await fetch(`${main_url}/${creator_id}/${webhook_key}/task.item.list?` +
        qs.stringify({
          order: {
            ID: 'desc'
          },
          filter: {
            TAG: 'certification'
          },
          start: B24.start
        }))
        .then(response => response.json())
        .then(B24.step));
      } while (B24.start !== undefined);
      return tasks;
    }

    static get_task(id = null) {
      if (id === null) {
        throw new Error('id is not defined');
      }

      return fetch(`${main_url}/${creator_id}/${webhook_key}/task.item.getdata?ID=${id}`)
        .then(rsp=> rsp.json())
        .then(rsp => {
          let task;
          if (rsp.result) {
            task = new Task({ ...rsp.result });
            task.state = parse(
              rsp.result.DESCRIPTION,
              rsp.result.UF_CRM_TASK
            );
          }
          return task;
        });
  }

    static async get_standards() {
      let standards = [];

      do {
        standards = standards.concat(await fetch(`${main_url}/${creator_id}/${webhook_key}/crm.product.list?` + 
          qs.stringify({
            order: {
              NAME: 'ASC'
            },
            filter: {
              SECTION_ID: 8582
            },
            select: ['NAME'],
            start: B24.start
          }))
          .then(response => response.json())
          .then(B24.step));
      } while (B24.start !== undefined);
      return standards.map(standard => ({ value: standard.NAME, label: standard.NAME }));
    }

    static async get_products() {
      let products = [];

      const productSections = new Map([ [8568, 'XMF'], [8574, 'XMT'], [8572, 'XMS'] ]);
      let productsInSection = [];

      for (let [sectionId, brand] of productSections) {
        do {
          productsInSection = productsInSection.concat(await fetch(`${main_url}/${creator_id}/${webhook_key}/crm.product.list?` +
            qs.stringify({
              order: {
                NAME: 'ASC'
              },
              filter: {
                SECTION_ID: sectionId
              },
              select: ['ID', 'NAME'],
              start: B24.start
            }))
          .then(response => response.json())
          .then(B24.step));
        } while (B24.start !== undefined);
        productsInSection = productsInSection.map(product => ({
          value: product.ID,
          label: product.NAME
        }));
        products.push({
          label: brand,
          options: [ ...productsInSection ]
        });

        productsInSection.length = 0;
      };

      return products;
  }
  
  static get_product(id = null) {
    if (id === null) {
      throw Error('Product id is not provided');
    }

    return fetch(`${ main_url }/${ creator_id }/${ webhook_key }/crm.product.get?id=${ id }`)
      .then(response => response.json())
      .then(json => json.result);
  }
}

export default B24;