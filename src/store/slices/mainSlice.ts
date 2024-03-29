import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { baseStages, repeatStages } from 'defaults';

type ActiveStandardsType = (
  | 'EN 11611'
  | 'EN 11612'
  | 'EN 469'
  | 'EN 20471'
  | 'EN 13034'
  | 'EN 61482-1-2'
  | 'all'
)[];
export interface IInitialState {
  activeTestingCompanies: ('satra' | 'bttg' | 'aitex' | 'all')[];
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
  activeStandards: ActiveStandardsType;
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
    changeStages: (state: IInitialState, { payload }) => {
      state.stages = payload;
    },
    changeActiveTestingCompanies: (
      state: IInitialState,
      {
        payload: { checked, testingCompany },
      }: PayloadAction<{
        testingCompany: IInitialState['activeTestingCompanies'][number];
        checked: boolean;
      }>
    ) => {
      if (testingCompany === 'all') {
        state.activeTestingCompanies = ['all'];
        return;
      }
      state.activeTestingCompanies = checked
        ? [...state.activeTestingCompanies, testingCompany].filter(
            (tc) => tc !== 'all'
          )
        : state.activeTestingCompanies.filter((tc) => tc !== testingCompany);
    },
    changeActiveStandards: (
      state: IInitialState,
      {
        payload: { checked, standard },
      }: PayloadAction<{
        standard: IInitialState['activeStandards'][number];
        checked: boolean;
      }>
    ) => {
      if (['all', 'EN 469', 'EN 20471'].includes(standard)) {
        state.activeStandards = [standard];
        return;
      }
      state.activeStandards = checked
        ? [...state.activeStandards, standard].filter(
            (st) => !['all', 'EN 469', 'EN 20471'].includes(st)
          )
        : state.activeStandards.filter((tc) => tc !== standard);
    },
    changeActiveQuoteNo: (state: IInitialState, { payload }) => {
      state.activeQuoteNo = payload;
    },
    changeUpdated: (state: IInitialState, { payload }) => {
      state.updated = payload;
    },
    changeTotalPrice: (
      state: IInitialState,
      { payload }: PayloadAction<number>
    ) => {
      state.totalPrice = payload;
    },
    changeTasks: (state: IInitialState, { payload }) => {
      state.allTasks = payload;
    },
    changeItems: (state: IInitialState, { payload }) => {
      state.allItems = payload;
    },
    changeTask: (state: IInitialState, { payload }) => {
      const idx = state.allTasks.findIndex((task) => task.id === payload.id);
      state.allTasks[idx] = payload.task;
    },
    changeActiveBrands: (state: IInitialState, { payload }) => {
      state.activeBrands = payload;
    },
    changeStartDate: (
      state: IInitialState,
      { payload }: PayloadAction<IInitialState['startDate']>
    ) => {
      state.startDate = payload;
    },
    changeEndDate: (
      state: IInitialState,
      { payload }: PayloadAction<IInitialState['endDate']>
    ) => {
      state.endDate = payload;
    },
    changeFilteredItems: (state: IInitialState, { payload }) => {
      state.filteredItems = payload;
    },
    changeFilteredTasks: (state: IInitialState, { payload }) => {
      state.filteredTasks = payload;
    },
    changeAdditionalStandardFilterList: (
      state: IInitialState,
      { payload }: PayloadAction<string[]>
    ) => {
      state.additionalStandardFilterTaskList = payload;
    },
    changePaymentsOfTask: (
      state: IInitialState,
      { payload: { taskId, payments } }
    ) => {
      const idx = state.allTasks.findIndex((task) => task.id === taskId);
      state.allTasks[idx].state.payments = payments;
    },
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
