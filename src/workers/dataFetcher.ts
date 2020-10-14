import qs from 'qs';
import Task from '../Task/Task';

const creator_id = process.env.REACT_APP_B24_USER_ID;
const tag = process.env.REACT_APP_TAG;
const webhook_key = process.env.REACT_APP_B24_WEBHOOK_KEY;
const main_url = process.env.REACT_APP_B24_MAIN_URL;

let start: number;

const step = (json: any) => {
  start = json.next;
  return json.result;
};

const getAttachedFiles = (id: string) =>
  fetch(
    `${main_url}/${creator_id}/${webhook_key}/task.item.getfiles?` +
      qs.stringify({ TASKID: id })
  )
    .then((res) => res.json())
    .then(({ result }: any) => result)
    .catch((e) => []);

export async function getTasks() {
  let rawTasks: {
    id: string;
    title: string;
    description: string;
    ufCrmTask: [];
  }[] = [];
  const tasks: any = [];
  do {
    rawTasks = rawTasks.concat(
      await fetch(
        `${main_url}/${creator_id}/${webhook_key}/tasks.task.list?` +
          qs.stringify({
            order: { ID: 'desc' },
            filter: { TAG: tag },
            select: ['ID', 'TITLE', 'DESCRIPTION', 'UF_CRM_TASK'],
            start,
          })
      )
        .then((res) => res.json())
        .then((json) => step(json).tasks)
    );
  } while (start !== undefined);

  for (let i = 0; i < rawTasks.length; i++) {
    const task = {
      ...new Task({
        description: rawTasks[i].description,
        ufCrmTask: rawTasks[i].ufCrmTask,
      }),
      id: rawTasks[i].id,
      title: rawTasks[i].title,
      ufTaskWebdavFiles: [],
    };

    if (
      ['7. Test-report ready', '8. Certificate ready', '9. Ended'].includes(
        task.state.stage
      )
    ) {
      task.ufTaskWebdavFiles = await getAttachedFiles(rawTasks[i].id);
    }

    tasks.push(task);
  }

  postMessage(tasks);
}
