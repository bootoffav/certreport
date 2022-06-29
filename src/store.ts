import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  activeTestingCompanies: string[];
  startDate: string | null;
  endDate: string | null;
  activeQuoteNo: string;
  updated: boolean;
  totalPrice: number;
  allTasks: [];
  allItems: [];
  activeBrands: string[];
  filteredItems: [];
  filteredTasks: [];
}

const initialState: IInitialState = {
  activeTestingCompanies: ['all'],
  activeQuoteNo: '',
  updated: false,
  totalPrice: 0,
  allTasks: [],
  allItems: [],
  activeBrands: ['XMT', 'XMS', 'XMF'],
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
  },
});

const store = configureStore({
  reducer: {
    main: mainSlice.reducer,
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
} = mainSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export default store;
