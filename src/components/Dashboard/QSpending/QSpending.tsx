import { Grid, Card, Header } from 'tabler-react';
import { useEffect, useState } from 'react';
import type { TaskState } from '../../../Task/Task.interface';
import DB from '../../../backend/DBManager';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import './QSpending.css';
import { query as q } from 'faunadb';

dayjs.extend(quarterOfYear);

interface QSpendingProps {
  updateQuarters: (quarters: any) => void;
  renderTable: (t: any[]) => void;
  tasks: any;
  startDate?: Date;
  endDate?: Date;
}

interface Quarter {
  active: boolean;
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  spent: number;
  tasks: TaskState[];
}

function QSpending(props: QSpendingProps) {
  // const quarters = assignTasksToQuarters(
  //   props.tasks,
  //   findQuarters(props.startDate, props.endDate)
  // );
  const [quarters, setQuarters] = useState(() => {
    const quartersWithTasks = assignTasksToQuarters(
      props.tasks,
      findQuarters(props.startDate, props.endDate)
    );
    return quartersWithTasks;
  });

  useEffect(() => {
    console.log('hit');
    DB.client()
      .query(
        q.Map(
          q.Paginate(q.Documents(q.Collection('payments'))),
          q.Lambda('payment', q.Get(q.Var('payment')))
        )
      )
      .then(({ data: paymentSet }: any) => {
        const payments = {};
        for (const {
          data: { payments: paymentsPerTask },
          ref: {
            value: { id },
          },
        } of paymentSet) {
          // @ts-ignore
          payments[id] = paymentsPerTask;
        }
        return payments;
      })
      .then((payments: any) => {
        for (const task of props.tasks) {
          const paymentsPerTask = payments[task.id];
          if (!paymentsPerTask) continue;
          for (const p of paymentsPerTask) {
            if (p.paymentDate) {
              Object.entries(quarters).forEach(([_, quarter]: any) => {
                if (
                  quarter.start < dayjs(p.paymentDate) &&
                  dayjs(p.paymentDate) < quarter.end
                ) {
                  quarter.spent += Number(p.price);
                  quarter.tasks.push(task);
                }
              });
            }
          }
        }
        debugger;
        // setQuarters(quarters);
      });
  }, [props.tasks]); //eslint-disable-line

  // useEffect(() => {
  //   let quarters = findQuarters(props.startDate, props.endDate);
  //   let quartersWithTasks = assignTasksToQuarters(props.tasks, quarters);
  //   setQuarters(quartersWithTasks);
  // }, [props.startDate, props.endDate]); //eslint-disable-line

  return quarters.map((quarter: any, index: number) => {
    return (
      <Grid.Col key={quarter.start}>
        <Card>
          <Card.Header>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                checked={quarter.active}
                onChange={({ currentTarget: { checked } }) => {
                  // const updatedQuarters = { ...quarters };
                  // updatedQuarters[index].active = checked;
                  // setQuarters(countQuarterSpendings(updatedQuarters));
                  // props.updateQuarters(quarters);
                  // return { quarters: state.quarters };
                  // }
                  //     () => {
                  //       this.props.updateQuarters({
                  //         quarters: this.state.quarters,
                  //       });
                  //     }
                  // );
                }}
              />
            </div>
            <div
              className="mx-auto quarterHeader fix-quarter-label"
              onClick={() => props.renderTable(quarter.tasks)}
            >
              {`Q${quarter.start.quarter()}-${quarter.start.format('YY')}`}
            </div>
          </Card.Header>
          <Card.Body>
            <Header.H3 className="text-center">
              {`€${Math.round(quarter.spent).toLocaleString()}`}
            </Header.H3>
          </Card.Body>
        </Card>
      </Grid.Col>
    );
  });
}

// const { start, end } = getFirstLastTotalSpendingsMonths(quarters);

// componentDidUpdate(prevProps: any) {
//   const {
//     startDate: prevStart,
//     endDate: prevEnd,
//     tasks: prevTasks,
//   } = prevProps;
//   const { startDate, endDate } = this.props;
//   if (
//     prevStart !== startDate ||
//     prevEnd !== endDate ||
//     prevTasks !== this.props.tasks
//   ) {
//     let quarters = this.findQuarters(startDate, endDate);
//     quarters = this.countQuarterSpendings(quarters);
//     const { start, end } = this.getFirstLastTotalSpendingsMonths(quarters);

//     this.setState(
//       {
//         quarters,
//         startDate,
//         endDate,
//         total: {
//           start,
//           end,
//           amount: this.countTotalSpendings(quarters),
//         },
//       },
//       () => {
//         this.props.updateQuarters({ quarters: this.state.quarters });
//       }
//     );
//   }
// }

// считает траты целых кварталов
// const countQuarterSpendings = (quarters: any) => {
//   props.tasks.forEach((task: any) => {
//     const { paymentDate1 } = task.state;
//     // DB.get(task.id, 'payments', 'payments').then(({ paymentDate }) => {
//     //   debugger;
//     // });
//     Object.entries(quarters).forEach(([_, quarter]: any) => {
//       if (
//         quarter.start < dayjs(paymentDate1) &&
//         dayjs(paymentDate1) < quarter.end
//       ) {
//         quarter.spent += getTotalPriceHelper(task.state);
//         quarter.tasks.push(task);
//       }
//     });
//   });

//   return quarters;
// };

// -------------------------------------------------------------------------------

// function countTotalSpendings(quarters: any) {
//   return Math.round(
//     Object.values(quarters).reduce(
//       (acc: number, quarter: any) => acc + quarter.spent,
//       0
//     )
//   );
// }

// function getFirstLastTotalSpendingsMonths(quarters: any) {
//   // when date range is shorter than a quarter
//   if (quarters.length === 0) {
//     return { start: '', end: '' };
//   }
//   const start = `${quarters[0].start.format('MM.YYYY')}`;
//   const end = `${quarters[quarters.length - 1].end.format('MM.YYYY')}`;

//   return { start, end };
// }

function findQuarter(howMany: number, startDate?: Date): Quarter {
  let start = startDate ? dayjs(startDate) : dayjs().subtract(4, 'quarter');
  const q = start.add(howMany, 'quarter');
  return {
    start: q.startOf('quarter'),
    end: q.endOf('quarter'),
    spent: 0,
    tasks: [],
    active: false,
  };
}

// находит целые кварталы
function findQuarters(startDate?: Date, endDate?: Date): Quarter[] {
  var quarters: any = [];
  if (startDate && endDate) {
    let i = 1;
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    // checking if startDate is a start of its quarter
    if (start.isSame(start.startOf('quarter'), 'day')) {
      quarters.push({
        start: start.startOf('quarter'),
        end: start.endOf('quarter'),
        spent: 0,
        tasks: [],
        active: false,
      });
    }

    while (start.add(i, 'quarter').endOf('quarter') < end) {
      quarters.push(findQuarter(i++, startDate));
    }

    // checking if endDate is an end of its quarter
    if (start.add(i, 'quarter').endOf('quarter').isSame(end, 'day')) {
      quarters.push({
        start: start.add(i, 'quarter').startOf('quarter'),
        end: start.add(i, 'quarter').endOf('quarter'),
        spent: 0,
        tasks: [],
        active: false,
      });
    }

    return quarters;
  }

  // last for 4 quarters from today
  quarters = [findQuarter(0), findQuarter(1), findQuarter(2), findQuarter(3)];
  return quarters;
}

function assignTasksToQuarters(
  tasks: { state: TaskState }[],
  quarters: Quarter[]
) {
  for (const task of tasks) {
    const { paymentDate1: paymentDate } = task.state;
    Object.entries(quarters).forEach(([_, quarter]: any) => {
      if (
        quarter.start < dayjs(paymentDate) &&
        dayjs(paymentDate) < quarter.end
      ) {
        // quarter.spent += getTotalPriceHelper(task.state);
        quarter.tasks.push(task);
      }
    });
  }

  return quarters;
}

export default QSpending;
