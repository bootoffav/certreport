import faunadb, { query as q } from "faunadb";

class DB {

  static defaultData = {
    cycles: [5, ''],
    washTemp: 60,
    otherStandard1: 'According to Standard Mandotory Test Requirement'
  };

  static client() {
    if (typeof process.env.REACT_APP_FAUNADB_KEY !== 'string') {
      throw new Error('Problem with db key');
    }

    return new faunadb.Client({
      secret: process.env.REACT_APP_FAUNADB_KEY
    });
  }

  static getData(taskId: string, ) {
    return DB.client().query(q.Get(q.Match(q.Index('id'), +taskId)))
      .then((res: any) => res)
      .catch(() => 
        DB.client().query(
          q.Create(q.Class('aitexForm'),
            {
              data: {
                id: +taskId,
                ...DB.defaultData
              }
            }))
          .then((res: any) => res)
      );
  }

  static updateInstance(
    ref: string,
    { cycles, washTemp, otherStandard1, flatten: aitexForm, EN11612Detail }: any
  ) {
    DB.client().query(q.Update(q.Ref(q.Class("aitexForm"), ref), {
      data: {
        cycles,
        washTemp,
        otherStandard1,
        aitexForm,
        EN11612Detail
      }
    })).catch((e: any) => {
      console.log('Something wrong with updateIntance');
    });
  }
}

export { DB };