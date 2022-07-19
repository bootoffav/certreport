import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TaskState } from 'Task/Task.interface';

export interface IDashboardSlice {
  tasksOfActiveSpendingBlocks: TaskState[];
  spendingBlocksTimePeriod: 'month' | 'quarter' | 'year';
}
const initialState: IDashboardSlice = {
  tasksOfActiveSpendingBlocks: [],
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
  },
});

export const {
  changeActiveSpendingBlocksTasks,
  changeSpendingBlocksTimePeriod,
} = dashboardSlice.actions;
export default dashboardSlice;
