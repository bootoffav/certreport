import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface IInitialState {
  startDate: string | null;
  endDate: string | null;
  activeQuoteNo: string;
  updated: boolean;
  totalPrice: string;
  allTasks: [];
  allItems: [];
  activeBrands: string[];
}

const initialState: IInitialState = {
  activeQuoteNo: '',
  updated: false,
  totalPrice: '',
  allTasks: [],
  allItems: [],
  activeBrands: ['XMT', 'XMS', 'XMF'],
  endDate: null,
  startDate: null,
};

const mainSlice = createSlice({
  name: 'main',
  initialState,
  reducers: {
    changeActiveQuoteNo: (state, { payload }) => {
      state.activeQuoteNo = payload.value;
    },
    changeUpdated: (state, { payload }) => {
      state.updated = payload;
    },
    changeTotalPrice: (state, { payload }) => {
      state.totalPrice = payload.value;
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
} = mainSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export default store;
