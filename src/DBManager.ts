import faunadb, { query as q, errors } from "faunadb";
import { emptyState } from './defaults';

class DB {

  static fdbClass = process.env.REACT_APP_FAUNADB_CLASS || 'aitexForm';
  static fdbIndex = process.env.REACT_APP_FAUNADB_INDEX || 'id';

  static client() {
    if (typeof process.env.REACT_APP_FAUNADB_KEY !== 'string') {
      throw new Error('Problem with db key');
    }

    return new faunadb.Client({
      secret: process.env.REACT_APP_FAUNADB_KEY
    });
  }

  static async getData(taskId: string) {
    const res = await DB.client().query(q.Get(q.Match(q.Index(this.fdbIndex), +taskId)))
      .then((res: any) => res)
      .catch(async error => {
        if (error instanceof errors.NotFound) {
          return await this.createInstance(taskId, emptyState.DBState);
        }
        console.log(error);
      });
    const props = Object.getOwnPropertyNames(res.data);

    if (!props.includes('testRequirement')) res.data.testRequirement = emptyState.DBState.testRequirement;
    if (!props.includes('washPreTreatment')) res.data.washPreTreatment = emptyState.DBState.washPreTreatment;
    if (!props.includes('footer')) res.data.footer = emptyState.DBState.footer;

    return res;
  }

  static async createInstance(
    id: string,
    state: any
  ) {
    return DB.client().query(
      q.Create(q.Collection(this.fdbClass),
        {
          data: {
            id: +id, ...state
          }
        })
    )
  }

  static updateInstance(
    state: any
  ) {
    const { ref, ...data } = state;
    DB.client().query(q.Update(q.Ref(q.Collection(this.fdbClass), ref), {
      data: { ...data }
    })).catch(console.log);
  }
}

export { DB };