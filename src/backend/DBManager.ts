import { emptyState, fabricAppFormInitState } from '../Task/emptyState';
import type { IRequirement } from 'components/Form/Tabs/Standards/Requirements';
import type { TabProps } from 'components/ExpiringCerts/ExpiringCerts';

type CollectionType = 'aitex' | 'payments' | 'certification' | 'standards';

class DB {
  static fdbCollection: CollectionType =
    (import.meta.env.VITE_FAUNADB_CLASS as CollectionType) || 'aitex';
  static fdbIndex = import.meta.env.VITE_FAUNADB_INDEX || 'id';

  static genericGet(taskId: string, propertyToGet: string[]) {
    return DB.get(taskId, this.fdbCollection)
      .then((data) =>
        propertyToGet.reduce((acc, prop) => {
          // @ts-ignore
          acc[prop] = data[prop];
          return acc;
        }, {})
      )
      .catch((e) => ({}));
  }

  // static async queryIndex(index: string): Promise<string[]> {
  //   return await DB.client()
  //     .query(
  //       q.Map(
  //         q.Paginate(
  //           q.Union(
  //             q.Match(q.Index(index), 'fail'),
  //             q.Match(q.Index(index), 'pass'),
  //             q.Match(q.Index(index), 'partly')
  //           )
  //         ),
  //         q.Lambda('standard', q.Get(q.Var('standard')))
  //       )
  //     )
  //     .then(({ data }: any) => data.map(({ ref }: any) => ref.id))
  //     .catch(() => []);
  // }

  static async getRequirementsForStandard(
    standard: string
  ): Promise<IRequirement[]> {
    return await fetch(
      `https://${window.location.hostname}:3100/standards/${standard}`
    ).then((r) => r.json());
  }

  static get(id: string, collection: CollectionType, path?: string) {
    return fetch(
      `https://${window.location.hostname}:3100/${collection}/${id}`,
      {
        method: 'POST',
        body: JSON.stringify({ path }),
      }
    ).then((r) => r.json());
  }

  static async getFabricAppFormState(taskId: string) {
    const data = await DB.get(taskId, 'aitex');
    const props = Object.getOwnPropertyNames(data);

    if (!props.includes('testRequirement'))
      data.testRequirement = fabricAppFormInitState.testRequirement;
    if (!props.includes('washPreTreatment'))
      data.washPreTreatment = fabricAppFormInitState.washPreTreatment;
    if (!props.includes('footer')) data.footer = fabricAppFormInitState.footer;

    return data;
  }

  static updateInstance(
    taskId: string,
    state: any,
    collection: CollectionType = 'aitex',
    path?: string
  ) {
    const payload = { path, state };
    return fetch(
      `https://${window.location.hostname}:3100/${collection}/${taskId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
  }

  // static getExpiringCerts(months: TabProps['months']) {
  //   if (months === 0) {
  //     // expired certs case
  //     return DB.client().query(
  //       q.Filter(
  //         q.Filter(
  //           q.Paginate(q.Match('expirationDate')),
  //           q.Lambda(['ref', 'date'], q.Not(q.IsNull(q.Var('date'))))
  //         ),
  //         q.Lambda(
  //           ['ref', 'date'],
  //           q.LT(
  //             q.TimeDiff(q.ToDate(q.Now()), q.Date(q.Var('date')), 'days'),
  //             months // expired yesterday or futher on
  //           )
  //         )
  //       )
  //     );
  //   }

  expirationTimeWindowMap = new Map([
    [12, 180],
    [6, 90],
    [3, 30],
    [1, 0],
  ]); // [months, minimal days in range]

  //   return DB.client().query(
  //     q.Filter(
  //       q.Filter(
  //         q.Filter(
  //           q.Paginate(q.Match('expirationDate')),
  //           q.Lambda(['ref', 'date'], q.Not(q.IsNull(q.Var('date'))))
  //         ),
  //         q.Lambda(
  //           ['ref', 'date'],
  //           q.GTE(
  //             q.TimeDiff(q.ToDate(q.Now()), q.Date(q.Var('date')), 'days'),
  //             0
  //           )
  //         )
  //       ),
  //       q.Lambda(
  //         ['ref', 'date'],
  //         q.And(
  //           q.LTE(
  //             q.TimeDiff(q.ToDate(q.Now()), q.Date(q.Var('date')), 'days'),
  //             months * 30 // 6 months in days
  //           ),
  //           q.GTE(
  //             q.TimeDiff(q.ToDate(q.Now()), q.Date(q.Var('date')), 'days'),
  //             expirationTimeWindowMap.get(months) as Number
  //           )
  //         )
  //       )
  //     )
  //   );
  // }
}

export default DB;
