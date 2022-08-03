import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TaskState } from 'Task/Task.interface';

export interface IDashboardSlice {
  tasksOfActiveSpendingBlocks: TaskState[];
  spendingBlocksTimePeriod: 'month' | 'quarter' | 'year';
  chartResume: TaskState['resume'] | '' | 'allWithResults';
}
const initialState: IDashboardSlice = {
  tasksOfActiveSpendingBlocks: [],
  chartResume: '',
  spendingBlocksTimePeriod: 'quarter',
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    changeActiveSpendingBlocksTasks: (
      state,
      { payload }: PayloadAction<IDashboardSlice['tasksOfActiveSpendingBlocks']>
    ) => {
      state.tasksOfActiveSpendingBlocks = payload;
    },
    changeSpendingBlocksTimePeriod: (
      state,
      { payload }: PayloadAction<IDashboardSlice['spendingBlocksTimePeriod']>
    ) => {
      state.spendingBlocksTimePeriod = payload;
    },
    changeResume: (
      state,
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
} = dashboardSlice.actions;
export default dashboardSlice;
