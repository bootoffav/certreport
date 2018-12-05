import axios from 'axios';
import qs from 'qs';
import moment from 'moment';

function parse(response) {
    const prop_map = {
      'Applicant name': 'applicantName',
      'Product': 'product',
      'Code': 'code',
      'Article': 'article',
      'Colour': 'colour',
      'Length of sample, meters': 'length',
      'Width of sample, meters': 'width',
      'Part number': 'partNumber',
      'Roll number': 'rollNumber',
      'ISO': 'iso',
      'Testing company': 'tester',
      'Material needed': 'materialNeeded',
      'Testing time, days': 'testingTime',
      'to be sent on': 'sentOn',
      'to be received on': 'receivedOn',
      'tests to be started on': 'startedOn',
      'tests to be finished on': 'finishedOn',
      'results to be received on': 'resultsReceived'
    }
    const newState = {};
    let description = response.data.result.DESCRIPTION
                        .replace(/\[\/CODE\]\[B\]/gi, ':parameter_separator:')
                        .replace(/\[\/B\]\[CODE\]/gi, ':prop_value_separator:')
                        .replace(/\[B\]|\[\/CODE\]/gi, '')
                        .split(':parameter_separator:');

    const dates = ['sentOn', 'receivedOn', 'startedOn', 'finishedOn', 'resultsReceived'];
    description.forEach(prop => {
      const [prop_name, prop_value] = prop.split('::prop_value_separator:');
      if (dates.includes(prop_map[prop_name])) {
          newState[prop_map[prop_name]] = new Date(prop_value.trim());
        } else {
            newState[prop_map[prop_name]] = prop_value.trim();
      }
    });

    return newState;
};

class B24 {
    creator_id = process.env.REACT_APP_B24_USER_ID;
    webhook_key = process.env.REACT_APP_B24_WEBHOOK_KEY;
    main_url = process.env.REACT_APP_B24_MAIN_URL;
    default_params = {
        CREATED_BY: this.creator_id,
        AUDITORS: [5, 19],
        UF_CRM_TASK: ['CO_6295'],
        RESPONSIBLE_ID: 5,
        TAGS: ['certification']
    }

    formTaskFields = (state) => {
        const sentOn = moment(state.sentOn).format("DDMMMYYYY");
        const receivedOn = moment(state.receivedOn).format("DDMMMYYYY");
        const startedOn = moment(state.startedOn).format("DDMMMYYYY");
        const finishedOn = moment(state.finishedOn).format("DDMMMYYYY");
        const resultsReceived = moment(state.resultsReceived).format("DDMMMYYYY");

        return {
            TITLE: `${state.rollNumber}_AITEX - ${state.iso} ${state.colour} - ${state.article} ` +
                `${state.applicantName} (to send ${sentOn} - plan ${finishedOn} )`,
            DESCRIPTION: `[B]Applicant name:[/B][CODE]${state.applicantName}[/CODE]` +
                `[B]Product:[/B][CODE]${state.product}[/CODE]` +
                `[B]Code:[/B][CODE]${state.code}[/CODE]` +
                `[B]Article:[/B][CODE]${state.article}[/CODE]` +
                `[B]Colour:[/B][CODE]${state.colour}[/CODE]` +
                `[B]Length of sample, meters:[/B][CODE]${state.length}[/CODE]` +
                `[B]Width of sample, meters:[/B][CODE]${state.width}[/CODE]` +
                `[B]Part number:[/B][CODE]${state.partNumber}[/CODE]` +
                `[B]Roll number:[/B][CODE]${state.rollNumber}[/CODE]` +
                `[B]ISO:[/B][CODE]${state.iso}[/CODE]` +
                `[B]Testing company:[/B][CODE]${state.tester}[/CODE]` +
                `[B]Material needed:[/B][CODE]${state.materialNeeded}[/CODE]` +
                `[B]Testing time, days:[/B][CODE]${state.testingTime}[/CODE]` +
                `[B]to be sent on:[/B][CODE]${sentOn}[/CODE]` +
                `[B]to be received on:[/B][CODE]${receivedOn}[/CODE]` +
                `[B]tests to be started on:[/B][CODE]${startedOn}[/CODE]` +
                `[B]tests to be finished on:[/B][CODE]${finishedOn}[/CODE]` +
                `[B]results to be received on:[/B][CODE]${resultsReceived}[/CODE]`,
                ...this.default_params
        }
    };
    
    create_task(state) {
        const data = Object.assign({}, this.formTaskFields(state))
        return axios({
            method: 'post',
            url: `${this.main_url}/${this.creator_id}/${this.webhook_key}/task.item.add/`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify([data])
        });
    }

    update_task(state) {
        const data = Object.assign({}, this.formTaskFields(state))
        return axios({
            method: 'post',
            url: `${this.main_url}/${this.creator_id}/${this.webhook_key}/task.item.update/`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify([state.task_id, data])
        });
    }

    get_tasks() {
        const params = {
            ORDER: {
                ID: 'desc'
            },
            FILTER: {
                TAG: 'certification'
            }
        };
        return axios({
            method: 'get',
            url: `${this.main_url}/${this.creator_id}/${this.webhook_key}/task.item.list?` + qs.stringify(params),
        })
    }
    get_task(id = null) {
        if (id === null) {
            throw new Error('id is not defined');
        }
        return axios({
            method: 'get',
            url: `${this.main_url}/${this.creator_id}/${this.webhook_key}/task.item.getdata?ID=${id}`,
        })
    }
}

export default B24;
export { parse };