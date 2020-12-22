import { useState, useEffect } from 'react';
import { localizePrice } from '../../helpers';
import { DB } from '../../DBManager';

interface RequirementsProps {
  standard: string;
}

interface IRequirement {
  requirement: string;
  testMethod: string;
  cost: string;
  standard: string;
  exclude: boolean; // exclude by checkbox from subTotal
}

function Requirements(props: RequirementsProps) {
  const [requirements, setRequirements] = useState<IRequirement[]>([]);
  const [subTotal, setSubTotal] = useState(0);
  let jsx = <></>;

  useEffect(() => {
    (async function () {
      DB.getRequirementsForStandard(props.standard).then((r) => {
        r.forEach((el) => (el.exclude = false));
        setRequirements(r);
        const subTotal = countsubTotalWithDiscounts(r);
        setSubTotal(subTotal);
      });
    })();
  }, [props.standard]);

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
              <tr>
                <td>{r.requirement}</td>
                <td>
                  <div className="form-check">
                    <input
                      className="form-check-input position-static"
                      type="checkbox"
                      defaultChecked
                      value={r.requirement}
                      onChange={(e) => {
                        const r = appleCheckboxChange(e, requirements);
                        setRequirements(r);
                        const subTotal = countsubTotalWithDiscounts(r);
                        setSubTotal(subTotal);
                      }}
                    />
                  </div>
                </td>
                <td>{r.testMethod}</td>
                <td>{localizePrice(Number(r.cost))}</td>
                <td>
                  <input
                    disabled
                    type="number"
                    value={20}
                    width={8}
                    onChange={(e) => console.log(e.target.value)}
                  />
                </td>
                <td>{localizePrice(countCostWithDiscount(r.cost, 20))}</td>
              </tr>
            );
          })}
          <tr className="font-weight-bold">
            <td colSpan={5}>Subtotal</td>
            <td>{localizePrice(subTotal)}</td>
          </tr>
        </tbody>
      </table>
    );
  }

  return jsx;
}

function countsubTotalWithDiscounts(r: IRequirement[]): any {
  return r
    .filter((el) => !el.exclude)
    .map((el) => countCostWithDiscount(el.cost, 20))
    .reduce((cost: number, nextValue: number) => cost + nextValue, 0);
}

function appleCheckboxChange(
  { currentTarget }: React.SyntheticEvent,
  requirements: IRequirement[]
) {
  const tr = currentTarget.parentNode!.parentElement!.parentElement;
  if ((currentTarget as HTMLInputElement).checked) {
    tr!.style.textDecoration = '';
    tr!.style.color = '';
  } else {
    tr!.style.textDecoration = 'line-through';
    tr!.style.color = 'grey';
  }
  const requirement = (currentTarget as HTMLInputElement).value;
  const index = requirements.findIndex((el) => el.requirement === requirement);
  requirements[index].exclude = !requirements[index].exclude;
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
