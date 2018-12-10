import axios from 'axios';
import qs from 'qs';
import moment from 'moment';

function parse(description) {
    if (description.indexOf(':[/B]') === -1) {
        return null; // is not valid for parsing
    }
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
      'Testing company': 'testingCompany',
      'Material needed': 'materialNeeded',
      'Testing time, days': 'testingTime',
      'to be sent on': 'sentOn',
      'to be received on': 'receivedOn',
      'tests to be started on': 'startedOn',
      'tests to be finished on': 'finishedOn',
      'results to be received on': 'resultsReceived'
    }

    const parseSelectable = (prop_name, selectee) => {
        const ret_iso = [];
        selectee.split(',').forEach(value => {
            const standard = value.trim();
            ret_iso.push({
                value: standard,
                label: standard,
                id: prop_name
            });
        });
        return ret_iso;
    }
    const newState = {};
    description = description
                    .replace(/\[\/B\]/gi, ':prop_value_separator:')
                    .replace(/\[B\]|/gi, '')
                    .split('\n');
    const dates = ['sentOn', 'receivedOn', 'startedOn', 'finishedOn', 'resultsReceived'];
    
    description.forEach(prop => {
      const [prop_name, prop_value] = prop.split('::prop_value_separator:');
      if (dates.includes(prop_map[prop_name])) {
        newState[prop_map[prop_name]] = new Date(prop_value.trim());
      }
      else if (prop_map[prop_name] === 'iso' || prop_map[prop_name] === 'testingCompany') {
          newState[prop_map[prop_name]] = parseSelectable(prop_map[prop_name], prop_value.trim())
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
        const iso = state.iso.map(standard => standard.value).join(', ');
        const testingCompany = state.testingCompany.map(company => company.value).join(', ');

        return {
            TITLE: `${state.rollNumber}_AITEX - ${iso} ${state.colour} - ${state.article} ` +
                `${state.applicantName} (to send ${sentOn} - plan ${finishedOn} )`,
            DESCRIPTION: `[B]Applicant name:[/B] ${state.applicantName}\n` +
                `[B]Product:[/B] ${state.product}\n` +
                `[B]Code:[/B] ${state.code}\n` +
                `[B]Article:[/B] ${state.article}\n` +
                `[B]Colour:[/B] ${state.colour}\n` +
                `[B]Length of sample, meters:[/B] ${state.length}\n` +
                `[B]Width of sample, meters:[/B] ${state.width}\n` +
                `[B]Part number:[/B] ${state.partNumber}\n` +
                `[B]Roll number:[/B] ${state.rollNumber}\n` +
                `[B]ISO:[/B] ${iso}\n` +
                `[B]Testing company:[/B] ${testingCompany}\n` +
                `[B]Material needed:[/B] ${state.materialNeeded}\n` +
                `[B]Testing time, days:[/B] ${state.testingTime}\n` +
                `[B]to be sent on:[/B] ${sentOn}\n` +
                `[B]to be received on:[/B] ${receivedOn}\n` +
                `[B]tests to be started on:[/B] ${startedOn}\n` +
                `[B]tests to be finished on:[/B] ${finishedOn}\n` +
                `[B]results to be received on:[/B] ${resultsReceived}`,
                ...this.default_params
        }
    };
    
    create_task(state) {
        const data = Object.assign({}, this.formTaskFields(state));
        return axios({
            method: 'post',
            url: `${this.main_url}/${this.creator_id}/${this.webhook_key}/task.item.add/`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify([data])
        });
    }

    update_task(state, task_id = null) {
        if (task_id === null) {
            throw new Error('task id is not defined');
        }
        const data = Object.assign({}, this.formTaskFields(state));
        return axios({
            method: 'post',
            url: `${this.main_url}/${this.creator_id}/${this.webhook_key}/task.item.update/`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify([task_id, data])
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
    async get_task(id = null) {
        if (id === null) {
            throw new Error('id is not defined');
        }
        const response = await axios({
            method: 'get',
            url: `${this.main_url}/${this.creator_id}/${this.webhook_key}/task.item.getdata?ID=${id}`,
        });

        if (response.data.result) {
            var task = {...response.data.result};
            task.state = parse(response.data.result.DESCRIPTION);
        }

        return task;
    }
}

export default B24;
export { parse };