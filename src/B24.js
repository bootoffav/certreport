import axios from 'axios';
import qs from 'qs';

class B24 {
    constructor (){
        this.hostname = 'https://xmtextiles.bitrix24.ru/rest/5/wcdzeq70ot8krh1p/';
    }
    update_task(state) {
        let data = {
            TITLE: state.applicantName,
            RESPONSIBLE_ID: 5
        }
        console.log(data);
        axios({
            method: 'post',
            url: `${this.hostname}task.item.add/`,
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify([data])
        });
    }
}

export default B24;