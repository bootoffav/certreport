import faunadb, { query as q } from 'faunadb';
import { emptyState } from 'Task/emptyState';
import type { IRequirement } from 'components/Form/Tabs/Standards/Requirements';

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

  static genericGet(taskId: string, propertyToGet: string[]) {
    return DB.client()
      .query(
        q.Select(
          ['data', ...propertyToGet],
          q.Get(q.Ref(q.Collection(this.fdbCollection), taskId))
        )
      )
      .catch((e) => ({}));
  }

  static async queryIndex(index: string): Promise<string[]> {
    return await DB.client()
      .query(
        q.Map(
          q.Paginate(
            q.Union(
              q.Match(q.Index(index), 'fail'),
              q.Match(q.Index(index), 'pass'),
              q.Match(q.Index(index), 'partly')
            )
          ),
          q.Lambda('standard', q.Get(q.Var('standard')))
        )
      )
      .then(({ data }: any) => data.map(({ ref }: any) => ref.id))
      .catch(() => []);
  }

  static async getRequirementsForStandard(
    standard: string
  ): Promise<IRequirement[]> {
    return await DB.client().query(
      q.Select(
        'data',
        q.Map(
          q.Paginate(q.Match(q.Index('standard_name'), standard)),
          q.Lambda('standard', q.Get(q.Var('standard')))
        )
      )
    );
  }

  static async get(
    taskId: string,
    property: string,
    fdbCollection = this.fdbCollection
  ): Promise<any> {
    return await DB.client().query(
      q.Select(
        ['data', property],
        q.Get(q.Ref(q.Collection(fdbCollection), taskId))
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

  static async createInstance(
    taskId: string,
    state: any,
    fdbCollection = this.fdbCollection
  ) {
    return DB.client().query(
      q.Create(q.Ref(q.Collection(fdbCollection), taskId), {
        data: {
          ...state,
        },
      })
    );
  }

  static updateInstance(
    ref: string,
    state: any,
    fdbCollection = 'aitex',
    updateType: 'Replace' | 'Update' = 'Update'
  ) {
    return DB.client().query(
      q[updateType](q.Ref(q.Collection(fdbCollection), ref), {
        data: { ...state },
      })
    );
  }
}

export default DB;
