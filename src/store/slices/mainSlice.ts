import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import fetchPayments from './PaymentsThunk';
import { baseStages, repeatStages, testingCompanies } from 'defaults';

export interface IInitialState {
  activeTestingCompanies: (typeof testingCompanies[number] | 'all')[];
  startDate: string | null;
  endDate: string | null;
  activeQuoteNo: string;
  updated: boolean;
  totalPrice: number;
  stages: (
    | typeof baseStages[number]
    | typeof repeatStages[number]
    | 'all'
    | 'overdue'
    | 'ongoing'
  )[];
  allTasks: any[];
  allItems: any[];
  activeBrands: ('XMS' | 'XMF' | 'XMT' | 'No brand')[];
  filteredItems: any[];
  filteredTasks: any[];
  activeStandards: string[];
  additionalStandardFilterTaskList?: string[];
}

const initialState: IInitialState = {
  stages: ['all'],
  activeTestingCompanies: ['all'],
  activeBrands: ['XMT', 'XMS', 'XMF'],
  activeStandards: ['all'],
  activeQuoteNo: '',
  updated: false,
  totalPrice: 0,
  allTasks: [],
  allItems: [],
  endDate: null,
  startDate: null,
  filteredItems: [],
  filteredTasks: [],
};

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    changeStages: (state, { payload }) => {
      state.stages = payload;
    },
    changeActiveTestingCompanies: (state, { payload }) => {
      state.activeTestingCompanies = payload;
    },
    changeActiveQuoteNo: (state, { payload }) => {
      state.activeQuoteNo = payload;
    },
    changeUpdated: (state, { payload }) => {
      state.updated = payload;
    },
    changeTotalPrice: (state, { payload }: PayloadAction<number>) => {
      state.totalPrice = payload;
    },
    changeTasks: (state, { payload }) => {
      state.allTasks = payload;
    },
    changeItems: (state, { payload }) => {
      state.allItems = payload;
    },
    changeTask: (state, { payload }) => {
      const idx = state.allTasks.findIndex((task) => task.id === payload.id);
      state.allTasks[idx] = payload.task;
    },
    changeActiveBrands: (state, { payload }) => {
      state.activeBrands = payload;
    },
    changeStartDate: (
      state,
      { payload }: PayloadAction<IInitialState['startDate']>
    ) => {
      state.startDate = payload;
    },
    changeEndDate: (
      state,
      { payload }: PayloadAction<IInitialState['endDate']>
    ) => {
      state.endDate = payload;
    },
    changeFilteredItems: (state, { payload }) => {
      state.filteredItems = payload;
    },
    changeFilteredTasks: (state, { payload }) => {
      state.filteredTasks = payload;
    },
    changeActiveStandards: (state, { payload }) => {
      state.activeStandards = payload;
    },
    changeAdditionalStandardFilterList: (state, { payload }) => {
      state.additionalStandardFilterTaskList = payload;
    },
    changePaymentsOfTask: (state, { payload: { taskId, payments } }) => {
      const idx = state.allTasks.findIndex((task) => task.id === taskId);
      state.allTasks[idx].state.payments = payments;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPayments.fulfilled, (state, { payload: payments }) => {
      // put payments into state
      state.allTasks = state.allTasks.map((task) => ({
        ...task,
        state: {
          ...task.state,
          payments: payments[task.id] || [],
        },
      }));
    });
  },
});

export const {
  changeTasks,
  changeItems,
  changeActiveQuoteNo,
  changeTotalPrice,
  changeUpdated,
  changeActiveBrands,
  changeEndDate,
  changeStartDate,
  changeFilteredItems,
  changeFilteredTasks,
  changeActiveTestingCompanies,
  changeActiveStandards,
  changeAdditionalStandardFilterList,
  changePaymentsOfTask,
  changeStages,
  changeTask,
} = mainSlice.actions;

export default mainSlice;
