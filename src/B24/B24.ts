import qs from 'qs';
import dayjs from 'dayjs';
import { dataSeparator } from '../Task/Task';
import { StateAdapter } from '../StateAdapter';
import { AppFormExport } from '../components/Export/PDF/AppFormExport';
import {
  detachFileFromTask,
  getAttachedFiles,
  removeFileFromDisk,
} from './DiskMethods';
import { rawTaskProcessor } from '../workers/dataFetcher';
export const creatorId = process.env.REACT_APP_B24_USER_ID;
export const tag = process.env.REACT_APP_TAG;
export const responsibleId = process.env.REACT_APP_B24_RESPONSIBLE_ID;
export const webhookKey = process.env.REACT_APP_B24_WEBHOOK_KEY;
export const mainUrl = process.env.REACT_APP_B24_MAIN_URL;

const auditors: string[] = process.env.REACT_APP_B24_AUDITORS
  ? process.env.REACT_APP_B24_AUDITORS.split(',')
  : [];

const defaultParams = {
  CREATED_BY: creatorId,
  GROUP_ID: 21,
};

const step = (json: any) => ({
  next: json.next,
  result: json.result,
});

function makeUfCrmTaskField(state: any) {
  const brands_map: {
    [key: string]: string;
  } = {
    XMS: 'C_10037',
    XMF: 'C_10035',
    XMT: 'C_10033',
    XMG: 'C_10041',
  };
  let ufCrmTask = [];

  if (state.ufCrmTask) {
    state.ufCrmTask.forEach((item: string) => {
      if (
        !['C_10033', 'C_10035', 'C_10037', 'C_10041', 'CO_6295'].includes(item)
      ) {
        ufCrmTask.push(item);
      }
    });
  }

  ufCrmTask.push(brands_map[state.brand], 'CO_6295');

  return ufCrmTask;
}

function formTaskFields(state: any) {
  let stAd = new StateAdapter(state);
  const taskFields: any = {
    ...defaultParams,
    TAGS: [tag, state.article],
    UF_CRM_TASK: makeUfCrmTaskField(state),
    TITLE:
      `${state.serialNumber}_${state.testingCompany} - ${state.standards} (${state.pretreatment1}) - ${state.article}, ${state.colour} ` +
      `(send ${state.sentOn} - plan ${state.testFinishedOnPlanDate}) = ${(
        +state.price + +state.price2
      ).toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'EUR',
      })} | ${stAd.getStageForTitle()}${stAd.getNADForTitle()}`,
    DESCRIPTION:
      `${
        state.applicantName && `[B]Applicant name:[/B] ${state.applicantName}\n`
      }` +
      `${state.product && `[B]Product:[/B] ${state.product}\n`}` +
      `${state.code && `[B]Code:[/B] ${state.code}\n`}` +
      `${state.article && `[B]Article:[/B] ${state.article}\n`}` +
      `${state.colour && `[B]Colour:[/B] ${state.colour}\n`}` +
      `${
        state.serialNumber && `[B]Serial number:[/B] ${state.serialNumber}\n`
      }` +
      `${
        state.length && `[B]Length of sample, meters:[/B] ${state.length}\n`
      }` +
      `${state.width && `[B]Width of sample, meters:[/B] ${state.width}\n`}` +
      `${state.partNumber && `[B]Part number:[/B] ${state.partNumber}\n`}` +
      `${state.rollNumber && `[B]Roll number:[/B] ${state.rollNumber}\n`}` +
      `${
        state.standards && `[B]Standard:[/B] ${stAd.standardsWithResults}\n`
      }` +
      `${state.price && `[B]Price:[/B] ${state.price} €\n`}` +
      `${
        state.paymentDate ? `[B]Payment date:[/B] ${state.paymentDate}\n` : ''
      }` +
      `${
        stAd.secondPayment && `[B]Second payment:[/B] ${stAd.secondPayment}\n`
      }` +
      `${
        state.testingCompany &&
        `[B]Testing company:[/B] ${state.testingCompany}\n`
      }` +
      `${
        state.proformaReceivedDate &&
        state.proformaNumber &&
        `[B]Proforma:[/B] ${state.proformaReceivedDate}, ${state.proformaNumber}\n`
      }` +
      `${state.testReport && `[B]Test report:[/B] ${state.testReport}\n`}` +
      `${state.certificate && `[B]Certificate:[/B] ${state.certificate}\n`}` +
      `${
        state.materialNeeded &&
        `[B]Material needed:[/B] ${state.materialNeeded}\n`
      }` +
      `${
        state.testingTime && `[B]Testing time, days:[/B] ${state.testingTime}\n`
      }` +
      `${
        state.pretreatment1 && `[B]Pre-treatment 1:[/B] ${state.pretreatment1}`
      } ` +
      `${state.pretreatment1Result && `(${state.pretreatment1Result})`}` +
      '\n' +
      `${
        state.pretreatment2 &&
        `[B]Pre-treatment 2:[/B] ${state.pretreatment2}\n`
      }` +
      `${
        state.pretreatment3 &&
        `[B]Pre-treatment 3:[/B] ${state.pretreatment3}\n`
      }` +
      `${state.pausedUntil && `[B]Paused Until:[/B] ${state.pausedUntil}\n`}` +
      `${state.readyOn && `[B]Sample ready on:[/B] ${state.readyOn}\n`}` +
      `${state.sentOn && `[B]to be sent on:[/B] ${state.sentOn}\n`}` +
      `${
        state.receivedOn && `[B]to be received on:[/B] ${state.receivedOn}\n`
      }` +
      `${
        state.startedOn && `[B]tests to be started on:[/B] ${state.startedOn}\n`
      }` +
      `${
        stAd.testFinishedOn &&
        `[B]tests to be finished on:[/B] ${stAd.testFinishedOn}\n`
      }` +
      `${
        stAd.certReceivedOn &&
        `[B]results to be received on:[/B] ${stAd.certReceivedOn}\n`
      }` +
      `${state.stage && `[B]Stage:[/B] ${state.stage}\n`}` +
      `${state.news && `[B]News:[/B] ${state.news}\n`}` +
      `${state.rem && `[B]REM:[/B] ${state.rem}\n`}` +
      `${
        state.resume === undefined ? '' : `[B]Resume:[/B] ${state.resume}\n`
      }` +
      `${state.comments && `[B]Comments:[/B] ${state.comments}\n`}` +
      `${state.link && `[B]Edit:[/B] ${state.link}\n`}` +
      `${dataSeparator}\n` +
      (state.otherTextInDescription || ''),
  };
  if (state.certReceivedOnPlanDate)
    taskFields.DEADLINE = dayjs(state.certReceivedOnPlanDate).toISOString();

  return taskFields;
}

/**
 * @param  {string} id task ID
 * @param  {any} state
 */
async function handleApplicationForm(id: string, state: any) {
  const fileNamePrefix = 'Fabric Test Application Form_';

  // look for old appForm and remove it from task
  const attachedFiles = await getAttachedFiles(id);
  attachedFiles.forEach(({ NAME, FILE_ID, ATTACHMENT_ID }: any) => {
    if (NAME.startsWith(fileNamePrefix)) {
      detachFileFromTask(id, ATTACHMENT_ID);
      removeFileFromDisk(FILE_ID);
    }
  });

  const pdf = await new AppFormExport(state).create();
  pdf.getBase64((base64: string) => {
    fetch(`${mainUrl}/${creatorId}/${webhookKey}/task.item.addfile/`, {
      method: 'post',
      body: qs.stringify({
        TASK_ID: id,
        FILE: {
          NAME: `${fileNamePrefix}${state.serialNumber}_${state.article}.pdf`,
          CONTENT: base64,
        },
      }),
    });
  });
}

function createTask(state: any) {
  const defaultParams = {
    AUDITORS: auditors,
    PARENT_ID: 46902,
    RESPONSIBLE_ID: responsibleId,
  };

  const taskData = { ...formTaskFields(state), ...defaultParams };

  return fetch(`${mainUrl}/${creatorId}/${webhookKey}/task.item.add/`, {
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: qs.stringify([taskData]),
  })
    .then((r) => r.json())
    .then(({ result: taskId }) => {
      state.link = `[URL=certreport.xmtextiles.com/edit/${taskId}/]this task[/URL]`;
      updateTask(state, taskId); //to include link for editing
      return taskId;
    });
}

function updateTask(state: any, task_id: string | null = null) {
  if (task_id === null) {
    throw new Error('task id is not defined');
  }
  const task_data = formTaskFields(state);

  handleApplicationForm(task_id, state);
  return fetch(`${mainUrl}/${creatorId}/${webhookKey}/task.item.update/`, {
    method: 'post',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: qs.stringify([task_id, task_data]),
  });
}

function fileUpload(taskId: string | undefined, name: string, content: string) {
  if (taskId) {
    return fetch(`${mainUrl}/${creatorId}/${webhookKey}/task.item.addfile/`, {
      method: 'post',
      body: qs.stringify({
        TASK_ID: taskId,
        FILE: {
          NAME: name,
          CONTENT: btoa(content),
        },
      }),
    }).then((res) => res.json());
  } else {
    throw new Error('Task Id is not defined');
  }
}

async function getTask(id: string | undefined) {
  if (id === null) {
    throw new Error('id is undefined');
  }

  return await fetch(
    `${mainUrl}/${creatorId}/${webhookKey}/tasks.task.get?` +
      qs.stringify({
        taskId: id,
        select: [
          'ID',
          'TITLE',
          'DESCRIPTION',
          'UF_CRM_TASK',
          'UF_TASK_WEBDAV_FILES',
          'CREATED_DATE',
        ],
      })
  )
    .then((rsp) => rsp.json())
    .then(async ({ result }: any) => {
      const [task] = rawTaskProcessor([result.task]);
      task.ufTaskWebdavFiles = await getAttachedFiles(task.id);
      return task;
    });
}

async function getItemAssociatedTasks(item: string) {
  const { result } = await fetch(
    `${mainUrl}/${creatorId}/${webhookKey}/tasks.task.list?` +
      qs.stringify({
        order: { ID: 'desc' },
        filter: { TAG: item },
        select: ['ID', 'TITLE', 'DESCRIPTION', 'UF_CRM_TASK', 'CREATED_DATE'],
      })
  )
    .then((res) => res.json())
    .then(step);

  const tasks = rawTaskProcessor(result.tasks);
  for (let i = 0; i < tasks.length; i++) {
    tasks[i].ufTaskWebdavFiles = await getAttachedFiles(tasks[i].id);
  }

  return tasks;
}

async function get_standards() {
  let standards: {
    value: string;
    label: string;
    NAME: string;
  }[] = [];

  let start = 0;
  do {
    const { next, result } = await fetch(
      `${mainUrl}/${creatorId}/${webhookKey}/crm.product.list?` +
        qs.stringify({
          order: {
            NAME: 'ASC',
          },
          filter: {
            SECTION_ID: 8582,
          },
          select: ['NAME'],
          start,
        })
    )
      .then((res) => res.json())
      .then(step);
    start = next;
    standards = standards.concat(result);
  } while (start !== undefined);
  return standards.map((standard) => ({
    value: standard.NAME,
    label: standard.NAME,
  }));
}

async function get_products() {
  const products = [];

  const productSections = [
    [8568, 'XMF'],
    [8574, 'XMT'],
    [8572, 'XMS'],
  ];
  let productsInSection: any[] = [];

  let start = 0;
  for (let [sectionId, brand] of productSections) {
    do {
      const { next, result } = await fetch(
        `${mainUrl}/${creatorId}/${webhookKey}/crm.product.list?` +
          qs.stringify({
            order: {
              NAME: 'ASC',
            },
            filter: {
              SECTION_ID: sectionId,
            },
            select: ['ID', 'NAME'],
            start,
          })
      )
        .then((res) => res.json())
        .then(step);
      start = next;
      productsInSection = productsInSection.concat(result);
    } while (start !== undefined);
    productsInSection = productsInSection.map((product) => ({
      value: product.ID,
      label: product.NAME,
    }));
    products.push({
      label: brand,
      options: [...productsInSection],
    });

    productsInSection.length = 0;
  }

  return products;
}

function get_product(id = null) {
  if (id === null) {
    throw Error('Product id is not provided');
  }

  return fetch(`${mainUrl}/${creatorId}/${webhookKey}/crm.product.get?id=${id}`)
    .then((res) => res.json())
    .then((json) => json.result);
}

export {
  get_product,
  get_standards,
  get_products,
  createTask,
  getTask,
  getItemAssociatedTasks,
  fileUpload,
  updateTask,
  detachFileFromTask,
  getAttachedFiles,
  removeFileFromDisk,
};
