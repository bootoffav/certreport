import qs from 'qs';
const creator_id = process.env.REACT_APP_B24_USER_ID;
const tag = process.env.REACT_APP_TAG;
const webhook_key = process.env.REACT_APP_B24_WEBHOOK_KEY;
const main_url = process.env.REACT_APP_B24_MAIN_URL;

let start: number | undefined  = undefined;

const step = (json: any) => {
    start = json.next;
    return json.result;
};

export async function getTasksID() {
    let response: { id: string }[] = [];

    do {
        response = response.concat(await fetch(`${main_url}/${creator_id}/${webhook_key}/tasks.task.list?` +
            qs.stringify({
                order: { ID: 'desc' },
                filter: { TAG: tag },
                select: ['ID'],
                start: start
            }))
            .then(res => res.json())
            .then(json => step(json).tasks));

    } while (start !== undefined);
    
    const ids = response.map(t => t.id);
    
    // @ts-ignore
    postMessage(ids);
};