import { useState, useEffect, useContext } from 'react';
import { localizePrice } from '../../helpers';
import { DB } from '../../DBManager';
import { StandardContext } from './Standards';
import { CostChanger } from './CostChanger';

interface RequirementsProps {
  standard: string;
}

interface IRequirement {
  data: {
    requirement: string;
    testMethod: string;
    cost: string;
    standard: string;
    exclude: boolean; // exclude by checkbox from subTotal
  };
  ref: any;
}

function Requirements(props: RequirementsProps) {
  const [requirements, setRequirements] = useState<IRequirement[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  const { setTotalPrice } = useContext(StandardContext);
  let jsx = <></>;

  /**
   * initial price request and setUp
   */
  useEffect(() => {
    (async function () {
      DB.getRequirementsForStandard(props.standard).then((r) => {
        r.forEach((el) => (el.data.exclude = false));
        setRequirements(r);
        const subTotal = countsubTotalWithDiscounts(r);
        setSubTotal(subTotal);
      });
    })();
  }, [props.standard]);

  /**
   * performs updates on Total price
   */
  useEffect(setTotalPrice, [subTotal, setTotalPrice]);

  if (requirements.length) {
    jsx = (
      <table className="table requirement-table">
        <thead className="thead-light">
          <tr>
            <th scope="col">Requirement</th>
            <th scope="col">Apply</th>
            <th scope="col">Test Method</th>
            <th scope="col">Cost (€)</th>
            <th scope="col">Discount %</th>
            <th scope="col">Cost - Discount (€)</th>
          </tr>
        </thead>
        <tbody>
          {requirements.map((r) => {
            return (
              <tr key={r.data.requirement}>
                <td width={'45%'}>{r.data.requirement}</td>
                <td>
                  <div className="form-check">
                    <input
                      className="form-check-input position-static"
                      type="checkbox"
                      defaultChecked
                      value={r.data.requirement}
                      onChange={(e) => {
                        const r = appleCheckboxChange(e, requirements);
                        setRequirements(r);
                        const subTotal = countsubTotalWithDiscounts(r);
                        setSubTotal(subTotal);
                      }}
                    />
                  </div>
                </td>
                <td width={'30%'}>{r.data.testMethod}</td>
                <td width={'20%'}>
                  <CostChanger cost={r.data.cost} refInDb={r.ref.value.id} />
                </td>
                <td width={'10%'}>
                  <input
                    disabled
                    type="number"
                    value={20}
                    onChange={(e) => console.log(e.target.value)}
                  />
                </td>
                <td>{localizePrice(countCostWithDiscount(r.data.cost, 20))}</td>
              </tr>
            );
          })}
          <tr className="font-weight-bold">
            <td colSpan={5}>Subtotal</td>
            <td className="subTotal">{localizePrice(subTotal)}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  return jsx;
}

function countsubTotalWithDiscounts(r: IRequirement[]): any {
  return r
    .filter((el) => !el.data.exclude)
    .map((el) => countCostWithDiscount(el.data.cost, 20))
    .reduce((cost: number, nextValue: number) => cost + nextValue, 0);
}

function appleCheckboxChange(
  { currentTarget }: React.SyntheticEvent,
  requirements: IRequirement[]
) {
  const tr = currentTarget.parentNode!.parentElement!.parentElement;
  const index = requirements.findIndex(
    (el) => el.data.requirement === (currentTarget as HTMLInputElement).value
  );

  if ((currentTarget as HTMLInputElement).checked) {
    tr!.style.textDecoration = '';
    tr!.style.color = '';
    requirements[index].data.exclude = false;
  } else {
    tr!.style.textDecoration = 'line-through';
    tr!.style.color = 'grey';
    requirements[index].data.exclude = true;
  }

  return requirements;
}

function countCostWithDiscount(
  cost: string | number,
  discount: string | number
): number {
  cost = Number(cost);
  discount = Number(discount);

  return cost - (cost / 100) * discount;
}

export type { IRequirement };
export { Requirements };
