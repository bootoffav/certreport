import { createAsyncThunk } from '@reduxjs/toolkit';
import DB from 'backend/DBManager';
import { query as q } from 'faunadb';
import { RootState } from 'store/store';
import { Payments } from 'Task/Task.interface';

const fetchPayments = createAsyncThunk(
  'common/fetchPayments',
  async (): Promise<any> => {
    const payments: Payments = {};
    const { data: paymentSet } = (await DB.client().query(
      q.Map(
        q.Paginate(q.Documents(q.Collection('payments')), {
          size: 100000, // max for faunadb for a single query
        }),
        q.Lambda('payment', q.Get(q.Var('payment')))
      )
    )) as any;

    for (const {
      data: { payments: paymentsPerTask },
      ref: {
        value: { id },
      },
    } of paymentSet) {
      payments[id] = paymentsPerTask;
    }

    return payments;
  },
  {
    condition: (_, { getState }) =>
      Object.getOwnPropertyNames((getState() as RootState).main.payments)
        .length === 0,
  }
);

export default fetchPayments;
