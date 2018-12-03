import axios from 'axios';
import qs from 'qs';

const creator_id = 5;
const webhook_key = 'wcdzeq70ot8krh1p';

class B24 {
    constructor (){
        this.main_url_part = 'https://xmtextiles.bitrix24.ru/rest';
        this.default_params = {
            CREATED_BY: creator_id,
            AUDITORS: [5],
            UF_CRM_TASK: ['CO_6295'],
            RESPONSIBLE_ID: 5,
            TAGS: ['certification']
        }
    }

    formTaskFields = (state) => ({
            TITLE: `${state.rollNumber} AITEX - ${state.colour} ${state.iso} - ${state.article} ` +
                `${state.applicantName} (to send ${state.startedOn} - plan${state.finishedOn} )`,
            DESCRIPTION: `Applicant name: ${state.applicantName}\n` +
                `Product: ${state.product}\n` +
                `Code: ${state.code}\n` +
                `Article: ${state.article}\n` +
                `Colour: ${state.colour}\n` +
                `Length of sample, meters: ${state.length}\n` +
                `Width of sample, meters: ${state.width}\n` +
                `Part number: ${state.partNumber}\n` +
                `Roll number: ${state.rollNumber}\n` +
                `ISO: ${state.iso}\n` +
                `Testing company:${state.tester}`,
                ...this.default_params
    });
    
    create_task(state) {
        const data = Object.create({}, this.formTaskFields(state))

        axios({
            method: 'post',
            url: `${this.main_url_part}/${creator_id}/${webhook_key}/task.item.add/`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify([data])
        }).then(response => console.log)
          .catch(err => console.log);
    }


    update_task(state) {
        const data = Object.assign({}, this.formTaskFields(state))
        axios({
            method: 'post',
            url: `${this.main_url_part}/${creator_id}/${webhook_key}/task.item.update/`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify([state.task_id, data])
        }).then(response => console.log)
          .catch(err => console.log);
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
            url: `${this.main_url_part}/${creator_id}/${webhook_key}/task.item.list?` + qs.stringify(params),
        })
        //   .catch(response => console.log(response));
    }
    get_task(id = null) {
        if (id === null) {
            throw new Error('id is not defined');
        }
        return axios({
            method: 'get',
            url: `${this.main_url_part}/${creator_id}/${webhook_key}/task.item.getdata?ID=${id}`,
        })
    }
}

export default B24;