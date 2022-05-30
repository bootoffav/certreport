import { Grid, Card, Header } from 'tabler-react';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import './QSpending.css';
// import { getTotalPriceHelper } from 'helpers';
import { useSelector } from 'react-redux';
import { RootState } from 'store';
import DB from 'backend/DBManager';
import { query as q } from 'faunadb';
import { Task } from 'Task/Task';
import { Payment } from 'Task/Task.interface';

dayjs.extend(quarterOfYear);

interface QSpendingProps {
  updateQuarters: (quarters: any) => void;
  renderTable: (t: any[]) => void;
  tasks: any;
}

interface Quarter {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  spent: number;
  tasks: Task[];
}

type Payments = {
  [key: number]: Payment[];
};

function QSpending({ tasks, ...props }: QSpendingProps) {
  const startDate = useSelector(
    ({ main: { startDate } }: RootState) => startDate
  );

  const endDate = useSelector(({ main: { endDate } }: RootState) => endDate);

  const [quarters, setQuarters] = useState(
    [findQuarter(0), findQuarter(1), findQuarter(2), findQuarter(3)] // default last 4 quarters
  );
  const [payments, setPayments] = useState({});

  useEffect(() => {
    if (startDate && endDate) {
      const specificQuarters = findSpecificQuarters(startDate, endDate);
      const newQ = applyPaymentsToQuartersAndPutAssociatedTasks(
        specificQuarters,
        payments,
        tasks
      );
      setQuarters(newQ);
    }
  }, [startDate, endDate, payments, tasks]);

  // run once upon initial payments collection
  useEffect(() => {
    const newQ = applyPaymentsToQuartersAndPutAssociatedTasks(
      quarters,
      payments,
      tasks
    );
    console.log(payments);
    setQuarters(newQ);
  }, [payments, quarters, tasks]);

  // set payments
  useEffect(() => {
    if (tasks.length) {
      const payments: Payments = {};
      (async () =>
        await DB.client()
          .query(
            q.Map(
              q.Paginate(q.Documents(q.Collection('payments'))),
              q.Lambda('payment', q.Get(q.Var('payment')))
            )
          )
          .then(({ data: paymentSet }: any) => {
            for (const {
              data: { payments: paymentsPerTask },
              ref: {
                value: { id },
              },
            } of paymentSet) {
              payments[id] = paymentsPerTask;
            }
            setPayments(payments);
          }))();
    }
  }, [tasks]);

  // refactor ASAP
  // useEffect(() => {

  //   const newQuarters: Quarter[] = quarters.map((quarter) => ({
  //     ...quarter,
  //     spent: 0,
  //     tasks: [],
  //   }));

  // if (tasks.length) {
  //   const payments: Payments = {};
  //   (async () =>
  //     await DB.client()
  //       .query(
  //         q.Map(
  //           q.Paginate(q.Documents(q.Collection('payments'))),
  //           q.Lambda('payment', q.Get(q.Var('payment')))
  //         )
  //       )
  //       .then(({ data: paymentSet }: any) => {
  //         for (const {
  //           data: { payments: paymentsPerTask },
  //           ref: {
  //             value: { id },
  //           },
  //         } of paymentSet) {
  //           payments[id] = paymentsPerTask;
  //         }
  // setQuarters(
  //   applyPaymentsToQuartersAndPutAssociatedTasks(
  //     newQuarters,
  //     payments
  //   )
  // );
  // }))();
  // return;
  // }

  //   setQuarters(newQuarters);
  // }, [tasks]); //eslint-disable-line

  return quarters.map((quarter: any, index: number) => {
    return (
      <Grid.Col key={quarter.start}>
        <Card>
          <Card.Header>
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

export default QSpending;

const findQuarter = (howMany: number, sDate?: any): Quarter => {
  let start = sDate ? dayjs(sDate) : dayjs().subtract(4, 'quarter');
  const q = start.add(howMany, 'quarter');
  return {
    start: q.startOf('quarter'),
    end: q.endOf('quarter'),
    spent: 0,
    tasks: [],
  };
};

const findSpecificQuarters = (
  startDate: string,
  endDate: string
): Quarter[] => {
  let quarters: Quarter[] = [];
  let i = 1;
  const sDate = dayjs(startDate);
  const eDate = dayjs(endDate);

  // checking if startDate is a start of its quarter
  if (sDate.isSame(sDate.startOf('quarter'), 'day')) {
    quarters.push({
      start: sDate.startOf('quarter'),
      end: sDate.endOf('quarter'),
      spent: 0,
      tasks: [],
    });
  }

  while (sDate.add(i, 'quarter').endOf('quarter') < eDate) {
    quarters.push(findQuarter(i++, startDate));
  }

  // checking if endDate is an end of its quarter
  if (sDate.add(i, 'quarter').endOf('quarter').isSame(eDate, 'day')) {
    quarters.push({
      start: sDate.add(i, 'quarter').startOf('quarter'),
      end: sDate.add(i, 'quarter').endOf('quarter'),
      spent: 0,
      tasks: [],
    });
  }

  return quarters;
};

function applyPaymentsToQuartersAndPutAssociatedTasks(
  newQuarters: Quarter[],
  payments: Payments,
  tasks: any
) {
  for (const task of tasks) {
    const paymentsPerTask = payments[task.id];
    if (!paymentsPerTask) continue;
    for (const { paymentDate, price } of paymentsPerTask) {
      if (paymentDate) {
        Object.entries(newQuarters).forEach(([_, quarter]) => {
          if (
            quarter.start < dayjs(paymentDate) &&
            dayjs(paymentDate) < quarter.end
          ) {
            quarter.spent += Number(price);
            quarter.tasks.push(task);
          }
        });
      }
    }
  }
  return newQuarters;
}
