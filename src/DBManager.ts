import faunadb, { query as q } from 'faunadb';
import { emptyState } from './Task/emptyState';

class DB {
  static fdbCollection = process.env.REACT_APP_FAUNADB_CLASS || 'aitex';
  static fdbIndex = process.env.REACT_APP_FAUNADB_INDEX || 'id';

  static client() {
    if (typeof process.env.REACT_APP_FAUNADB_KEY !== 'string') {
      throw new Error('Problem with db key');
    }

    return new faunadb.Client({
      secret: process.env.REACT_APP_FAUNADB_KEY,
    });
  }

  static getStandards(taskId: string) {
    return DB.client()
      .query(
        q.Select(
          ['data', 'standards'],
          q.Get(q.Ref(q.Collection(this.fdbCollection), taskId))
        )
      )
      .catch((e) => ({}));
  }

  static getStandardDetail(taskId: string, standard: string) {
    return DB.client().query(
      q.Select(
        ['data', `${standard}Detail`],
        q.Get(q.Ref(q.Collection(this.fdbCollection), taskId))
      )
    );
  }

  static async getData(taskId: string) {
    const data = await DB.client()
      .query(
        q.Select(
          ['data'],
          q.Get(q.Ref(q.Collection(this.fdbCollection), taskId))
        )
      )
      .then((res: any) => ({
        ...res,
        exists: true,
      }))
      .catch(async (error) => {
        return {
          ...emptyState.DBState,
          exists: false,
        };
      });
    const props = Object.getOwnPropertyNames(data);

    if (!props.includes('testRequirement'))
      data.testRequirement = emptyState.DBState.testRequirement;
    if (!props.includes('washPreTreatment'))
      data.washPreTreatment = emptyState.DBState.washPreTreatment;
    if (!props.includes('footer')) data.footer = emptyState.DBState.footer;

    return data;
  }

  static async createInstance(taskId: string, state: any) {
    return DB.client().query(
      q.Create(q.Ref(q.Collection(this.fdbCollection), taskId), {
        data: {
          ...state,
        },
      })
    );
  }

  static updateInstance(taskId: string, state: any) {
    return DB.client().query(
      q.Update(q.Ref(q.Collection(this.fdbCollection), taskId), {
        data: { ...state },
      })
    );
  }
}

export { DB };
