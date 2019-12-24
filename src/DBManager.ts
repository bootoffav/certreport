import faunadb, { query as q, errors } from "faunadb";
import { emptyState } from './defaults';

class DB {

  static fdbCollection = process.env.REACT_APP_FAUNADB_CLASS || 'aitex';
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
    const data = await DB.client().query(q.Get(q.Ref(q.Collection(this.fdbCollection), taskId)))
      .then((res: any) => ({
        ...res.data,
        exists: true
      }))
      .catch(async error => {
        return {
          ...emptyState.DBState,
          EN11612Detail: emptyState.EN11612Detail,
          exists: false
        };
      });
    const props = Object.getOwnPropertyNames(data);

    if (!props.includes('testRequirement')) data.testRequirement = emptyState.DBState.testRequirement;
    if (!props.includes('washPreTreatment')) data.washPreTreatment = emptyState.DBState.washPreTreatment;
    if (!props.includes('footer')) data.footer = emptyState.DBState.footer;

    return data;
  }

  static async createInstance(
    id: string,
    state: any
  ) {
    return DB.client().query(
      q.Create(
        q.Ref(q.Collection(this.fdbCollection), id),
        {
          data: {
            ...state
          }
        })
    )
  }

  static updateInstance(
    ref: string,
    state: any
  ) {
    return DB.client().query(q.Update(q.Ref(q.Collection(this.fdbCollection), ref), {
      data: { ...state }
    }))
  }
}

export { DB };