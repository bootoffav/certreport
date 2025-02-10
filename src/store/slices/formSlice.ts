import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TaskState } from 'Task/Task.interface';

export interface FormSlice {
  factory: TaskState['factory'];
}

const initialState: FormSlice = { factory: '' };

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    changeFactory: (
      state: FormSlice,
      { payload }: PayloadAction<FormSlice['factory']>
    ) => {
      state.factory = payload;
    },
  },
});

export const { changeFactory } = formSlice.actions;
export default formSlice;
