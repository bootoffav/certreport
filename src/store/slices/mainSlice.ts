import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Payments } from 'Task/Task.interface';

interface IInitialState {
  activeTestingCompanies: string[];
  startDate: string | null;
  endDate: string | null;
  activeQuoteNo: string;
  updated: boolean;
  totalPrice: number;
  allTasks: any[];
  allItems: any[];
  activeBrands: string[];
  filteredItems: any[];
  filteredTasks: any[];
  activeStandards: string[];
  additionalStandardFilterTaskList?: string[];
  payments: Payments;
}

const initialState: IInitialState = {
  payments: {},
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
    setPayments: (state, { payload }) => {
      state.payments = payload;
    },
  },
});

export const {
  setPayments,
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
} = mainSlice.actions;

export { mainSlice };