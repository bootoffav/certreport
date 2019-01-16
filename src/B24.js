import qs from 'qs';
import moment from 'moment';
import parse from './Helpers';
import { generatePDF } from './PDF';

const creator_id = process.env.REACT_APP_B24_USER_ID;
const webhook_key = process.env.REACT_APP_B24_WEBHOOK_KEY;
const main_url = process.env.REACT_APP_B24_MAIN_URL;
const auditors = process.env.REACT_APP_B24_AUDITORS.split(',');


class B24 {
    static default_params = {
        CREATED_BY: creator_id,
        AUDITORS: auditors,
        UF_CRM_TASK: ['CO_6295'],
        RESPONSIBLE_ID: 5,
        TAGS: ['certification'],
        GROUP_ID: 21
    }

    static formTaskFields = state => {
      const formatDate = date => moment(date).format("DDMMMYYYY");
      const formatSelectee = selectee => Array.isArray(selectee)
        ? selectee.map(item => item.value).join(', ')
        : [selectee].map(item => item.value).join(', ')
      
        return {
        ...B24.default_params,
        TITLE: `${state.serialNumber}_AITEX - ${formatSelectee(state.standard)} - ${state.article}, ${state.colour} ` +
            `(send ${formatDate(state.sentOn)} - plan ${formatDate(state.resultsReceived)})`,
            // `(send ${formatDate(state.sentOn)} - plan ${formatDate(state.resultsReceived)}) = ${state.price} €`,
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
            `[B]Testing company:[/B] ${formatSelectee(state.testingCompany)}\n` +
            `[B]Material needed:[/B] ${state.materialNeeded}\n` +
            `[B]Testing time, days:[/B] ${state.testingTime}\n` +
            `[B]to be sent on:[/B] ${formatDate(state.sentOn)}\n` +
            `[B]to be received on:[/B] ${formatDate(state.receivedOn)}\n` +
            `[B]tests to be started on:[/B] ${formatDate(state.startedOn)}\n` +
            `[B]tests to be finished on:[/B] ${formatDate(state.finishedOn)}\n` +
            `[B]results to be received on:[/B] ${formatDate(state.resultsReceived)}`,
        DEADLINE: moment(state.resultsReceived).toISOString(),
        UF_CRM_TASK: B24.default_params.UF_CRM_TASK.concat(state.brand[0].value)
      }
    };

    static createTask = state => {

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

      return fetch(`${main_url}/${creator_id}/${webhook_key}/task.item.add/`, {
        method: 'post',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: qs.stringify([
          Object.assign({}, B24.formTaskFields(state))
        ])
      })
        .then(r => r.json())
        .then(response => attachPDF(response.result));
    }

    static updateTask(state, task_id = null) {
        if (task_id === null) {
            throw new Error('task id is not defined');
        }
        const task_data = Object.assign({}, B24.formTaskFields(state));
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

    // static async get_task(id = null) {
    //     let task;
    //     if (id === null) {
    //         throw new Error('id is not defined');
    //     }
    //     const result = await fetch(`${main_url}/${creator_id}/${webhook_key}/task.item.getdata?ID=${id}`)
    //       .then(rsp=> rsp.json()).then(rsp => rsp.result);

    //     if (result) {
    //         task = { ...result };
    //         task.state = parse(
    //           result.DESCRIPTION,
    //           result.UF_CRM_TASK
    //         );
    //     }

    //     return task;
    // }

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

      do {
        products = products.concat(await fetch(`${main_url}/${creator_id}/${webhook_key}/crm.product.list?` +
          qs.stringify({
            order: {
              NAME: 'ASC'
            },
            filter: {
              SECTION_ID: 8568
            },
            select: ['ID', 'NAME'],
            start
          }))
        .then(response => response.json())
        .then(step));
      } while (start !== undefined);
      
      return products.map(product => ({
        value: product.ID,
        label: product.NAME
      }));
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