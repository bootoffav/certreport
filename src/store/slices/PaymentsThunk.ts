import { createAsyncThunk } from '@reduxjs/toolkit';
import DB from 'backend/DBManager';
import { query as q } from 'faunadb';
import { Payment } from 'Task/Task.interface';

const fetchPayments = createAsyncThunk(
  'common/fetchPayments',
  async (): Promise<any> => {
    let payments: {
      [key: number]: Payment[];
    } = {};
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
  }
);

export default fetchPayments;
