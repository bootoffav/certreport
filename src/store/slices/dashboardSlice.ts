import { createSlice } from '@reduxjs/toolkit';

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    tasksOfActiveQuarters: [] as any[],
  },
  reducers: {
    changeActiveQuarterTasks: (state, { payload }) => {
      state.tasksOfActiveQuarters = payload;
    },
  },
});

export const { changeActiveQuarterTasks } = dashboardSlice.actions;
export default dashboardSlice;
