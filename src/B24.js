import axios from 'axios';
import qs from 'qs';
import moment from 'moment';
import parse from './Helpers';

const creator_id = process.env.REACT_APP_B24_USER_ID;
const webhook_key = process.env.REACT_APP_B24_WEBHOOK_KEY;
const main_url = process.env.REACT_APP_B24_MAIN_URL;


class B24 {
    default_params = {
        CREATED_BY: this.creator_id,
        AUDITORS: [5, 19],
        UF_CRM_TASK: ['CO_6295'],
        RESPONSIBLE_ID: 5,
        TAGS: ['certification']
    }

    formTaskFields = state => {
        const formatDate = date => moment(date).format("DDMMMYYYY");
        const formatSelectee = selectee => selectee.map(item => item.value).join(', ');

        return {
            TITLE: `${state.serialNumber}_AITEX - ${formatSelectee(state.iso)} ${state.colour} - ${state.article} ` +
                `${state.applicantName} (send ${formatDate(state.sentOn)} - plan ${formatDate(state.resultsReceived)})`,
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
                `[B]ISO:[/B] ${formatSelectee(state.iso)}\n` +
                `[B]Testing company:[/B] ${formatSelectee(state.testingCompany)}\n` +
                `[B]Material needed:[/B] ${state.materialNeeded}\n` +
                `[B]Testing time, days:[/B] ${state.testingTime}\n` +
                `[B]to be sent on:[/B] ${formatDate(state.sentOn)}\n` +
                `[B]to be received on:[/B] ${formatDate(state.receivedOn)}\n` +
                `[B]tests to be started on:[/B] ${formatDate(state.startedOn)}\n` +
                `[B]tests to be finished on:[/B] ${formatDate(state.finishedOn)}\n` +
                `[B]results to be received on:[/B] ${formatDate(state.resultsReceived)}`,
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
            url: `${main_url}/${creator_id}/${webhook_key}/task.item.update/`,
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
            url: `${main_url}/${creator_id}/${webhook_key}/task.item.list?` + qs.stringify(params),
        })
    }
    static async get_task(id = null) {
        let task;
        if (id === null) {
            throw new Error('id is not defined');
        }
        const response = await axios({
            method: 'get',
            url: `${main_url}/${creator_id}/${webhook_key}/task.item.getdata?ID=${id}`,
        });

        if (response.data.result) {
            task = {...response.data.result};
            task.state = parse(response.data.result.DESCRIPTION);
        }

        return task;
    }
}

export default B24;