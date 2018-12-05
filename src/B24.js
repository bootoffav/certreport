import axios from 'axios';
import qs from 'qs';

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

    description.forEach(prop => {
      const [prop_name, prop_value] = prop.split('::prop_value_separator:')
      newState[prop_map[prop_name]] = prop_value.trim()
    });

    return newState;
};

class B24 {
    creator_id = 5;
    webhook_key = 'wcdzeq70ot8krh1p';
    default_params = {
        CREATED_BY: this.creator_id,
        AUDITORS: [5],
        UF_CRM_TASK: ['CO_6295'],
        RESPONSIBLE_ID: 5,
        TAGS: ['certification']
    }
    main_url_part = 'https://xmtextiles.bitrix24.ru/rest';

    formTaskFields = (state) => ({
            TITLE: `${state.rollNumber}_AITEX - ${state.iso} ${state.colour} - ${state.article} ` +
                `${state.applicantName} (to send ${state.startedOn} - plan ${state.finishedOn} )`,
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
                `[B]to be sent on:[/B][CODE]${state.sentOn}[/CODE]` +
                `[B]to be received on:[/B][CODE]${state.receivedOn}[/CODE]` +
                `[B]tests to be started on:[/B][CODE]${state.startedOn}[/CODE]` +
                `[B]tests to be finished on:[/B][CODE]${state.finishedOn}[/CODE]` +
                `[B]results to be received on:[/B][CODE]${state.resultsReceived}[/CODE]`,
                ...this.default_params
    });
    
    create_task(state) {
        const data = Object.assign({}, this.formTaskFields(state))
        return axios({
            method: 'post',
            url: `${this.main_url_part}/${this.creator_id}/${this.webhook_key}/task.item.add/`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify([data])
        });
    }

    update_task(state) {
        const data = Object.assign({}, this.formTaskFields(state))
        return axios({
            method: 'post',
            url: `${this.main_url_part}/${this.creator_id}/${this.webhook_key}/task.item.update/`,
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
            url: `${this.main_url_part}/${this.creator_id}/${this.webhook_key}/task.item.list?` + qs.stringify(params),
        })
    }
    get_task(id = null) {
        if (id === null) {
            throw new Error('id is not defined');
        }
        return axios({
            method: 'get',
            url: `${this.main_url_part}/${this.creator_id}/${this.webhook_key}/task.item.getdata?ID=${id}`,
        })
    }
}

export default B24;
export { parse };