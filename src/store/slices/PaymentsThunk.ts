import { createAsyncThunk } from '@reduxjs/toolkit';
import DB from 'backend/DBManager';
import { query as q } from 'faunadb';
import { Payment } from 'Task/Task.interface';

const fetchPayments = createAsyncThunk(
  'common/fetchPayments',
  async (): Promise<Record<number, Payment[]>> =>
    DB.client()
      .query<{ data: any }>(
        q.Map(
          q.Paginate(q.Documents(q.Collection('payments')), {
            size: 100000, // max for faunadb for a single query
          }),
          q.Lambda('payment', q.Get(q.Var('payment')))
        )
      )
      .then(({ data }: any) =>
        data.reduce(
          (payments: Record<number, Payment[]>, { ref: { id }, data }: any) => {
            payments[id] = data.payments;
            return payments;
          },
          {}
        )
      )
);

export default fetchPayments;
