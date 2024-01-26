import qs from 'qs';
import { Task } from '../Task/Task';

const creator_id = import.meta.env.VITE_B24_USER_ID;
const tag = import.meta.env.VITE_TAG;
const webhook_key = import.meta.env.VITE_B24_WEBHOOK_KEY;
const main_url = import.meta.env.VITE_B24_MAIN_URL;

let start: number;

const step = (json: any) => {
  start = json.next;
  return json.result;
};

function rawTaskProcessor(tasks: any[]) {
  return tasks.map(
    ({ description, ufCrmTask, id, title, createdDate, accomplices }) => ({
      ...new Task({
        description,
        ufCrmTask,
      }),
      id,
      title,
      createdDate,
      accomplices,
      ufTaskWebdavFiles: [],
    })
  );
}

async function getTasks() {
  let rawTasks: {
    id: string;
    title: string;
    description: string;
    ufCrmTask: [];
    createdDate: string;
  }[] = [];

  do {
    rawTasks = rawTasks.concat(
      await fetch(
        `${main_url}/${creator_id}/${webhook_key}/tasks.task.list?` +
          qs.stringify({
            order: { ID: 'desc' },
            filter: { TAG: tag },
            select: [
              'ID',
              'TITLE',
              'DESCRIPTION',
              'UF_CRM_TASK',
              'ACCOMPLICES',
              'CREATED_DATE',
            ],
            start,
          })
      )
        .then((res) => res.json())
        .then((json) => step(json).tasks)
    );
  } while (start !== undefined);

  const tasks = rawTaskProcessor(rawTasks);
  return tasks;
}

export default getTasks;
export { rawTaskProcessor };
