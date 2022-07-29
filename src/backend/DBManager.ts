import faunadb, { query as q } from 'faunadb';
import { emptyState } from 'Task/emptyState';
import type { IRequirement } from 'components/Form/Tabs/Standards/Requirements';
import type { TabProps } from 'components/ExpiringCerts/ExpiringCerts';

type CollectionType = 'aitex' | 'payments' | 'certification' | 'standards';

class DB {
  static fdbCollection: CollectionType =
    (process.env.REACT_APP_FAUNADB_CLASS as CollectionType) || 'aitex';
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
    ref: string,
    path: string[],
    fdbCollection = this.fdbCollection
  ): Promise<any> {
    return await DB.client().query(
      q.Select(path, q.Get(q.Ref(q.Collection(fdbCollection), ref)))
    );
  }

  static async getFabricAppFormState(taskId: string) {
    const data = await DB.client()
      .query(q.Select(['data'], q.Get(q.Ref(q.Collection('aitex'), taskId))))
      .then((res: any) => ({
        ...res,
        exists: true,
      }))
      .catch(async (error) => {
        return {
          ...emptyState.FabricAppForm,
          exists: false,
        };
      });
    const props = Object.getOwnPropertyNames(data);

    if (!props.includes('testRequirement'))
      data.testRequirement = emptyState.FabricAppForm.testRequirement;
    if (!props.includes('washPreTreatment'))
      data.washPreTreatment = emptyState.FabricAppForm.washPreTreatment;
    if (!props.includes('footer'))
      data.footer = emptyState.FabricAppForm.footer;

    return data;
  }

  static async createInstance(
    taskId: string,
    state: any,
    fdbCollection: CollectionType = this.fdbCollection
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
    taskId: string,
    state: any,
    fdbCollection: CollectionType = 'aitex'
  ) {
    return DB.client()
      .query(
        q.Update(q.Ref(q.Collection(fdbCollection), taskId), {
          data: { ...state },
        })
      )
      .catch(({ message }) => {
        message === 'instance not found' &&
          DB.createInstance(taskId, state, fdbCollection);
      });
  }

  static getExpiringCerts(months: TabProps['months']) {
    if (months === 0) {
      // expired certs case
      return DB.client().query(
        q.Filter(
          q.Filter(
            q.Paginate(q.Match('expirationDate')),
            q.Lambda(['ref', 'date'], q.Not(q.IsNull(q.Var('date'))))
          ),
          q.Lambda(
            ['ref', 'date'],
            q.LT(
              q.TimeDiff(q.ToDate(q.Now()), q.Date(q.Var('date')), 'days'),
              months // expired yesterday or futher on
            )
          )
        )
      );
    }

    const expirationTimeWindowMap = new Map([
      [12, 180],
      [6, 90],
      [3, 30],
      [1, 0],
    ]); // [months, minimal days in range]

    return DB.client().query(
      q.Filter(
        q.Filter(
          q.Filter(
            q.Paginate(q.Match('expirationDate')),
            q.Lambda(['ref', 'date'], q.Not(q.IsNull(q.Var('date'))))
          ),
          q.Lambda(
            ['ref', 'date'],
            q.GTE(
              q.TimeDiff(q.ToDate(q.Now()), q.Date(q.Var('date')), 'days'),
              0
            )
          )
        ),
        q.Lambda(
          ['ref', 'date'],
          q.And(
            q.LTE(
              q.TimeDiff(q.ToDate(q.Now()), q.Date(q.Var('date')), 'days'),
              months * 30 // 6 months in days
            ),
            q.GTE(
              q.TimeDiff(q.ToDate(q.Now()), q.Date(q.Var('date')), 'days'),
              expirationTimeWindowMap.get(months) as Number
            )
          )
        )
      )
    );
  }
}

export default DB;
