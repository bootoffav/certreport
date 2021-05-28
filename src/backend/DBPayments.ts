import { query as q } from 'faunadb';
import { DB } from './DBManager';
import type { Payment } from '../Task/Task.interface';

class DBPayments extends DB {
  static async get(taskId: string): Promise<Payment[]> {
    return await DB.client().query(
      q.Select(
        ['data', 'payments'],
        q.Get(q.Ref(q.Collection('payments'), 62790))
      )
    );
  }
}

export { DBPayments };
// Get(Ref(Collection('payments'), 62790))
