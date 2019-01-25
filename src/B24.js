import qs from 'qs';
import moment from 'moment';
import parse, { dataSeparator } from './Helpers';
import { generatePDF } from './PDF';

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

    static makeUfCrmTaskField = state => {
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

      UF_CRM_TASK.push(state.brand[0].value, 'CO_6295');

      return UF_CRM_TASK;
    }
    
    static formTaskFields = state => {


      const formatDate = date => date ? moment(date).format("DDMMMYYYY") : '';
      const formatSelectee = selectee => Array.isArray(selectee)
        ? selectee.map(item => item.value).join(', ')
        : [selectee].map(item => item.value).join(', ')
      
        return {
        ...B24.defaultParams,
        UF_CRM_TASK: B24.makeUfCrmTaskField(state),
        TITLE: `${state.serialNumber}_AITEX - ${formatSelectee(state.standard)} - ${state.article}, ${state.colour} ` +
            `(send ${formatDate(state.sentOn)} - plan ${formatDate(state.resultsReceived)}) = ${state.price} €`,
        DESCRIPTION: `[B]Applicant name:[/B] ${state.applicantName}\n` +
            `[B]Product:[/B] ${state.product}\n` +
            `[B]Code:[/B] ${state.code}\n` +
            `[B]Article:[/B] ${state.article}\n` +
            `[B]Colour:[/B] ${state.colour}\n` +
            `[B]Serial number:[/B] ${state.serialNumber}\n` +
            `[B]Length of sample, meters:[/B] ${state.length}\n` +
            `[B]Width of sample, meters:[/B] ${state.width}\n` +
            `[B]Part number:[/B] ${state.partNumber}\n` +
            `[B]Roll number:[/B] ${state.rollNumber}\n` +
            `[B]Standard:[/B] ${formatSelectee(state.standard)}\n` +
            `[B]Price:[/B] ${(state.price)} €\n` +
            `[B]Testing company:[/B] ${formatSelectee(state.testingCompany)}\n` +
            `[B]Test report:[/B] ${(state.testReport)}\n` +
            `[B]Certificate:[/B] ${(state.certificate)}\n` +
            `[B]Material needed:[/B] ${state.materialNeeded}\n` +
            `[B]Testing time, days:[/B] ${state.testingTime}\n` +
            `${state.sentOn ? '[B]to be sent on:[/B]' + formatDate(state.sentOn) + '\n' : ''}` +
            `${state.receivedOn ? '[B]to be received on:[/B]' + formatDate(state.receivedOn) + '\n' : ''}` +
            `${state.startedOn ? '[B]tests to be started on:[/B]' + formatDate(state.startedOn) + '\n' : ''}` +
            `${state.finishedOn ? '[B]tests to be finished on:[/B]' + formatDate(state.finishedOn) + '\n' : ''}` +
            `${state.resultsReceived ? '[B]results to be received on:[/B]' + formatDate(state.resultsReceived) + '\n' : ''}` +
            `${state.comments ? '[B]Comments:[/B] ' + state.comments + '\n' : ''}` +
            `${state.link ? '[B]Edit:[/B] ' + state.link + '\n' : ''} ` +
            `${dataSeparator}` + (state.otherTextInDescription || ''),
        DEADLINE: moment(state.resultsReceived).toISOString()
      }
    };

    static createTask = state => {

      const defaultParams = {
        AUDITORS: auditors,
        RESPONSIBLE_ID: 5
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

    static get_tasks = () =>
      fetch(`${main_url}/${creator_id}/${webhook_key}/task.item.list?` +
        qs.stringify({
          order: {
            ID: 'desc'
          },
          filter: {
            TAG: 'certification'
          }
        }))
        .then(response => response.json())
        .then(json => json.result)

    static get_task(id = null) {
      if (id === null) {
        throw new Error('id is not defined');
      }

      return fetch(`${main_url}/${creator_id}/${webhook_key}/task.item.getdata?ID=${id}`)
        .then(rsp=> rsp.json())
        .then(rsp => {
          let task;
          if (rsp.result) {
            task = { ...rsp.result };
            task.state = parse(
              rsp.result.DESCRIPTION,
              rsp.result.UF_CRM_TASK
            );
          }
          return task;
        });
  }

    static async get_products() {
      let start = 0;
      let products = [];

      let step = json => {
        start = json.next;
        return json.result;
      };

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
              start
            }))
          .then(response => response.json())
          .then(step));
        } while (start !== undefined);
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