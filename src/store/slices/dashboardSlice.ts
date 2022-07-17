import { createSlice } from '@reduxjs/toolkit';
import type { TaskState } from 'Task/Task.interface';

const initialState: { tasksOfActiveSpendingBlocks: TaskState[] } = {
  tasksOfActiveSpendingBlocks: [],
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    changeActiveSpendingBlocksTasks: (state, { payload }) => {
      state.tasksOfActiveSpendingBlocks = payload;
    },
  },
});

export const { changeActiveSpendingBlocksTasks } = dashboardSlice.actions;
export default dashboardSlice;
