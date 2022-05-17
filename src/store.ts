import { configureStore, createSlice } from '@reduxjs/toolkit';

const quoteNoSlice = createSlice({
  name: 'activeQuoteNo',
  initialState: {
    value: '',
  },
  reducers: {
    changeActiveQuoteNo: (state, { payload }) => {
      state.value = payload.value;
    },
  },
});

const totalPriceSlice = createSlice({
  name: 'totalPrice',
  initialState: {
    value: '',
  },
  reducers: {
    changeTotalPrice: (state, { payload }) => {
      state.value = payload.value;
    },
  },
});

const store = configureStore({
  reducer: {
    activeQuoteNo: quoteNoSlice.reducer,
    totalPrice: totalPriceSlice.reducer,
  },
});

export const { changeActiveQuoteNo } = quoteNoSlice.actions;
export const { changeTotalPrice } = totalPriceSlice.actions;
export { store };
