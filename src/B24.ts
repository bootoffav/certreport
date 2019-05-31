import qs from 'qs';
import m from 'moment';
import { dataSeparator } from './Task/Task';
import Task from './Task/Task';
import PDF from './components/Export/PDF';
import StateAdapter from './StateAdapter';
import { IState } from './defaults';

m.fn.toJSON = function() { return this.format(); }
const creator_id = process.env.REACT_APP_B24_USER_ID;
const tag = process.env.REACT_APP_TAG;
const responsibleId = process.env.REACT_APP_B24_RESPONSIBLE_ID;
const webhook_key = process.env.REACT_APP_B24_WEBHOOK_KEY;
const main_url = process.env.REACT_APP_B24_MAIN_URL;

const auditors: string[] = process.env.REACT_APP_B24_AUDITORS ? process.env.REACT_APP_B24_AUDITORS.split(',') : [];


class B24 {

  private static _start : undefined;

    static defaultParams = {
        CREATED_BY: creator_id,
        TAGS: [tag],
        GROUP_ID: 21,
    }

    static get start() {
      return this._start;
    }

    static set start(start) {
      this._start = start;
    }

    static step = (json : any) => {
      B24.start = json.next;
      return json.result;
    };

    static makeUfCrmTaskField = (state : any) => {
      const brands_map : {
        [key: string]: string;
      } = {
        XMS: 'C_10037',
        XMF: 'C_10035',
        XMT: 'C_10033',
        XMG: 'C_10041'
      };
      let UF_CRM_TASK = [];
      
      if (state.UF_CRM_TASK) {
        state.UF_CRM_TASK.forEach((item : string)=> {
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
    
    static formTaskFields = (state : IState) => {
      let stAd = new StateAdapter(state);
      return {
      ...B24.defaultParams,
      UF_CRM_TASK: B24.makeUfCrmTaskField(state),
      TITLE: `${state.serialNumber}_${state.testingCompany} - ${state.standards} - ${state.article}, ${state.colour} ` +
          `(send ${state.sentOn} - plan ${state.testFinishedOnPlanDate}) = ${state.price} € | ${stAd.getStageForTitle()}`,
      DESCRIPTION: `${state.applicantName && `[B]Applicant name:[/B] ${state.applicantName}\n`}` +
          `${state.product && `[B]Product:[/B] ${state.product}\n`}` +
          `${state.code && `[B]Code:[/B] ${state.code}\n`}` +
          `${state.article && `[B]Article:[/B] ${state.article}\n`}` +
          `${state.colour && `[B]Colour:[/B] ${state.colour}\n`}` +
          `${state.serialNumber && `[B]Serial number:[/B] ${state.serialNumber}\n`}` +
          `${state.length && `[B]Length of sample, meters:[/B] ${state.length}\n`}` +
          `${state.width && `[B]Width of sample, meters:[/B] ${state.width}\n`}` +
          `${state.partNumber && `[B]Part number:[/B] ${state.partNumber}\n`}` +
          `${state.rollNumber && `[B]Roll number:[/B] ${state.rollNumber}\n`}` +
          `${state.standards && `[B]Standard:[/B] ${stAd.standardsWithResults}\n`}` +
          `${state.price && `[B]Price:[/B] ${state.price} €\n`}` +
          `${stAd.secondPayment && `[B]Second payment:[/B] ${stAd.secondPayment}\n`}` +
          `${state.paymentDate && `[B]Payment date:[/B] ${state.paymentDate}\n`}` +
          `${state.testingCompany && `[B]Testing company:[/B] ${state.testingCompany}\n`}` +
          `${state.proformaReceivedDate && state.proformaNumber && `[B]Proforma:[/B] ${state.proformaReceivedDate}, ${state.proformaNumber}\n`}` +
          `${state.testReport && `[B]Test report:[/B] ${state.testReport}\n`}` +
          `${state.certificate && `[B]Certificate:[/B] ${state.certificate}\n`}` +
          `${state.materialNeeded && `[B]Material needed:[/B] ${state.materialNeeded}\n`}` +
          `${state.testingTime && `[B]Testing time, days:[/B] ${state.testingTime}\n`}` +
          `${state.pretreatment1 && `[B]Pre-treatment 1:[/B] ${state.pretreatment1} (${state.pretreatment1Result})\n`}` +
          `${state.pretreatment2 && `[B]Pre-treatment 2:[/B] ${state.pretreatment2}\n`}` +
          `${state.pretreatment3 && `[B]Pre-treatment 3:[/B] ${state.pretreatment3}\n`}` +
          `${state.readyOn && `[B]Sample ready on:[/B] ${state.readyOn}\n`}` +
          `${state.sentOn && `[B]to be sent on:[/B] ${state.sentOn}\n`}` +
          `${state.receivedOn && `[B]to be received on:[/B] ${state.receivedOn}\n`}` +
          `${state.startedOn && `[B]tests to be started on:[/B] ${state.startedOn}\n`}` +
          `${stAd.testFinishedOn && `[B]tests to be finished on:[/B] ${stAd.testFinishedOn}\n`}` +
          `${stAd.certReceivedOn && `[B]results to be received on:[/B] ${stAd.certReceivedOn}\n`}` +
          `${state.stage && `[B]Stage:[/B] ${state.stage}\n`}` +
          `${state.resume == undefined ? '' : `[B]Resume:[/B] ${state.resume}\n`}` +
          `${state.comments && `[B]Comments:[/B] ${state.comments}\n`}` +
          `${state.link && `[B]Edit:[/B] ${state.link}\n`}` +
          `${dataSeparator}` + (state.otherTextInDescription || ''),
      DEADLINE: m(state.certReceivedOnPlanDate).toISOString()
    }
  };

    static createTask = (state : any) => {
      const defaultParams = {
        AUDITORS: auditors,
        PARENT_ID: 46902,
        RESPONSIBLE_ID: responsibleId
      }

      const attachPDF = (taskId: string) => {
        fetch(`${main_url}/${creator_id}/${webhook_key}/task.item.addfile/`, {
          method: 'post',
          body: qs.stringify({
            TASK_ID: taskId,
            FILE: {
              NAME: `${state.serialNumber} - ${state.applicantName}.pdf`,
              CONTENT: btoa(new PDF(state).pdf.output())
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

    static updateTask(state : any, task_id : string | null = null) {
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

  static fileUpload(
    taskId: string | undefined,
    name: string,
    content: string
  ) {
    if (taskId) {
      return fetch(`${main_url}/${creator_id}/${webhook_key}/task.item.addfile/`, {
        method: 'post',
        body: qs.stringify({
          TASK_ID: taskId,
          FILE: {
            NAME: name,
            CONTENT: btoa(content)
          }
        })
      })
        .then(response => response.json())
    } else {
      throw ('Task Id is not defined');
    }
  }

    static async get_tasks() {
      let tasks : {}[] = [];
      do {
        tasks = tasks.concat(await fetch(`${main_url}/${creator_id}/${webhook_key}/task.item.list?` +
        qs.stringify({
          order: { ID: 'desc' },
          filter: { TAG: tag },
          start: B24.start
        }))
        .then(response => response.json())
        .then(B24.step));
      } while (B24.start !== undefined);
      return tasks;
    }

  static get_task(id : string | undefined) {
    if (id === null) {
      throw new Error('id is undefined');
    }

    return fetch(`${main_url}/${creator_id}/${webhook_key}/task.item.getdata?ID=${id}`)
      .then(rsp=> rsp.json())
      .then(rsp => new Task(rsp.result));
  }

    static async get_standards() {
      let standards : {
        value: string;
        label: string;
        NAME: string;
      }[] = [];

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
      const products = [];

      const productSections = [ [8568, 'XMF'], [8574, 'XMT'], [8572, 'XMS'] ];
      let productsInSection : any[] = [];

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