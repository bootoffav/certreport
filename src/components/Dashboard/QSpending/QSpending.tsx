import { Grid, Card, Header } from 'tabler-react';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import './QSpending.css';
import { useAppSelector } from 'store/hooks';
import { Payments } from 'Task/Task.interface';
import TotalSpending from './TotalSpending';

dayjs.extend(quarterOfYear);

export interface QSpendingProps {
  renderTable: (t: any[]) => void;
}

export interface Quarter {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  spent: number;
  tasks: any[];
}

function QSpending(props: QSpendingProps) {
  const { startDate, endDate, tasks, payments } = useAppSelector(
    ({ main: { startDate, endDate, filteredTasks, payments } }) => ({
      startDate,
      endDate,
      tasks: filteredTasks,
      payments,
    })
  );

  const [quarters, setQuarters] = useState(
    [findQuarter(0), findQuarter(1), findQuarter(2), findQuarter(3)] // default last 4 quarters
  );

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

  useEffect(() => {
    if (Object.getOwnPropertyNames(payments).length) {
      const quartersWithTasksAndPayments =
        applyPaymentsToQuartersAndPutAssociatedTasks(quarters, payments, tasks);
      setQuarters(quartersWithTasksAndPayments);
    }
  }, [payments]); // eslint-disable-line

  return (
    <>
      {quarters.map((quarter: any, index: number) => {
        return (
          <Grid.Col key={quarter.start}>
            <Card>
              <Card.Header>
                <div
                  className="mx-auto quarterHeader fix-quarter-label"
                  onClick={() => props.renderTable(quarter.tasks)}
                >
                  {`Q${quarter.start.quarter()}-${quarter.start.format(
                    'YY'
                  )} / ${quarter.tasks.length} certifications`}
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
      })}
      <TotalSpending quarters={quarters} renderTable={props.renderTable} />
    </>
  );
}

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
  quarters: Quarter[],
  payments: Payments,
  tasks: any[]
) {
  const newQuarters: Quarter[] = quarters.map((q) => ({
    ...q,
    spent: 0,
    tasks: [],
  }));
  for (const task of tasks) {
    const paymentsPerTask = payments[task.id];
    if (!paymentsPerTask) continue;
    for (const { price } of paymentsPerTask) {
      Object.values(newQuarters).forEach((q) => {
        if (
          q.start < dayjs(task.createdDate) &&
          dayjs(task.createdDate) < q.end
        ) {
          q.spent += Number(price);
          if (q.tasks.find(({ id }: any) => id === task.id) === undefined) {
            q.tasks.push(task);
          }
        }
      });
    }
  }
  return newQuarters;
}

export default QSpending;
