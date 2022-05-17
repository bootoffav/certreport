import type { TaskState } from 'Task/Task.interface';

export const parentTasksMap = {
  2015: {
    XMF: 49121,
    XMT: 58898,
    XMS: 43128,
    base: 9593,
  },
  2016: {
    XMF: 29940,
    XMT: 29938,
    XMS: 29942,
    base: 18812,
  },
  2017: {
    XMF: 29932,
    XMT: 29930,
    XMS: 29934,
    base: 29866,
  },
  2018: {
    XMF: 39416,
    XMT: 39414,
    XMS: 39418,
    base: 38923,
  },
  2019: {
    XMF: 46902,
    XMT: 48606,
    XMS: 46916,
    base: 46832,
  },
  2020: {
    XMF: 59504,
    XMT: 59514,
    XMS: 59506,
    base: 59430,
  },
  2021: {
    XMF: 71620,
    XMT: 71618,
    XMS: 71622,
    base: 71596,
  },
  2022: {
    XMF: 97254,
    XMT: 97250,
    XMS: 97256,
    base: 97248,
  },
} as const;

function assignParentTask(createdDate?: string, brand?: TaskState['brand']) {
  try {
    const year = createdDate
      ? new Date(createdDate).getFullYear()
      : new Date().getFullYear();
    // @ts-ignore
    const taskId = parentTasksMap[year][brand];
    // @ts-ignore
    return taskId === undefined ? parentTasksMap[year].base : taskId; // case when brand has no corresponding task id
  } catch (e) {
    // @ts-ignore
    return '';
    // return parentTasksMap[year | currentYear].base;
  }
}

export default assignParentTask;
