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
  2023: {
    XMF: 114734,
    XMS: 114736,
    XMT: 114730,
    base: 114686,
  },
  2024: {
    XMF: 127861,
    XMS: 127863,
    XMT: 127857,
    base: 127855,
  },
  2025: {
    XMT: 143067,
    XMF: 143071,
    XMS: 143073,
    base: 143065,
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
    return '';
  }
}

export default assignParentTask;
