import faunadb, { query as q } from "faunadb";

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

  static getData(taskId: string, ) {
    return DB.client().query(q.Get(q.Match(q.Index(this.fdbIndex), +taskId)))
      .then((res: any) => res)
      .catch(console.log);
  }

  static async createInstance(
    id: string,
    state: any
  ) {
    DB.client().query(
      q.Create(q.Class(this.fdbClass),
        {
          data: {
            id, ...state
          }
        })
    )
  }

  static updateInstance(
    ref: string,
    state: any
  ) {
    DB.client().query(q.Update(q.Ref(q.Class(this.fdbClass), ref), {
      data: { ...state }
    })).catch(console.log);
  }
}

export { DB };