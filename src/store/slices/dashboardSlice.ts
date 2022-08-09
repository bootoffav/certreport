import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TaskState } from 'Task/Task.interface';

export interface IDashboardSlice {
  tasksOfActiveSpendingBlocks: TaskState[];
  spendingBlocksTimePeriod: 'month' | 'quarter' | 'year';
  chartResume: TaskState['resume'] | '' | 'allWithResults';
  tableTasks: TaskState[];
}
const initialState: IDashboardSlice = {
  tasksOfActiveSpendingBlocks: [],
  chartResume: '',
  spendingBlocksTimePeriod: 'quarter',
  tableTasks: [],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    changeTableTasks: (
      state: IDashboardSlice,
      { payload }: PayloadAction<IDashboardSlice['tableTasks']>
    ) => {
      state.tableTasks = payload;
    },
    changeActiveSpendingBlocksTasks: (
      state: IDashboardSlice,
      { payload }: PayloadAction<IDashboardSlice['tasksOfActiveSpendingBlocks']>
    ) => {
      state.tasksOfActiveSpendingBlocks = payload;
    },
    changeSpendingBlocksTimePeriod: (
      state: IDashboardSlice,
      { payload }: PayloadAction<IDashboardSlice['spendingBlocksTimePeriod']>
    ) => {
      state.spendingBlocksTimePeriod = payload;
    },
    changeResume: (
      state: IDashboardSlice,
      { payload }: PayloadAction<IDashboardSlice['chartResume']>
    ) => {
      state.chartResume = payload;
    },
  },
});

export const {
  changeActiveSpendingBlocksTasks,
  changeSpendingBlocksTimePeriod,
  changeResume,
  changeTableTasks,
} = dashboardSlice.actions;
export default dashboardSlice;
