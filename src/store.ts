import { configureStore, createSlice } from '@reduxjs/toolkit';

const mainSlice = createSlice({
  name: 'main',
  initialState: {
    activeQuoteNo: '',
    updated: false,
    totalPrice: '',
  },
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
  },
});

const store = configureStore({
  reducer: {
    main: mainSlice.reducer,
  },
});

export const { changeActiveQuoteNo, changeTotalPrice, changeUpdated } =
  mainSlice.actions;

export type RootState = ReturnType<typeof store.getState>;
export default store;
