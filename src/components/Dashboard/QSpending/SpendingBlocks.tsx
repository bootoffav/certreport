import { Grid, Card, Header } from 'tabler-react';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import styles from './SpendingBlocks.module.css';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { Payments, TaskState } from 'Task/Task.interface';
import TotalSpending from './TotalSpending';
import { changeActiveSpendingBlocksTasks } from 'store/slices/dashboardSlice';
import { roundToCents } from './SpendingBlocksHelpers';

dayjs.extend(quarterOfYear);

export interface SpendingBlocksProps {
  renderTable: (t: any[]) => void;
}

export interface SpendingBlock {
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  spent: number;
  tasks: TaskState[];
  active: boolean;
}

function SpendingBlocks(props: SpendingBlocksProps) {
  const dispatch = useAppDispatch();
  const { startDate, endDate, tasks, payments } = useAppSelector(
    ({ main: { startDate, endDate, filteredTasks, payments } }) => ({
      startDate,
      endDate,
      tasks: filteredTasks,
      payments,
    })
  );

  const [blocks, setBlocks] = useState(
    [findRange(0), findRange(1), findRange(2), findRange(3)] // default last 4 blocks as quarters
  );

  useEffect(() => {
    const blocks =
      startDate && endDate
        ? findSpecificRanges(startDate, endDate)
        : [findRange(0), findRange(1), findRange(2), findRange(3)];
    const spendingBlocks = roundToCents(
      applyPaymentsToSpendingBlocksAndPutAssociatedTasks(
        blocks,
        payments,
        tasks
      )
    );
    setBlocks(spendingBlocks);
  }, [startDate, endDate, payments, tasks]);

  useEffect(() => {
    const tasksOfActiveSpendingBlocks = blocks
      .filter(({ active }) => active)
      .reduce<SpendingBlock['tasks']>(
        (acc, { tasks }) => acc.concat(tasks),
        []
      );
    dispatch(changeActiveSpendingBlocksTasks(tasksOfActiveSpendingBlocks));
  }, [dispatch, blocks]);

  useEffect(() => {
    if (Object.getOwnPropertyNames(payments).length) {
      const spendingBlocks = roundToCents(
        applyPaymentsToSpendingBlocksAndPutAssociatedTasks(
          blocks,
          payments,
          tasks
        )
      );
      setBlocks(spendingBlocks);
    }
  }, [payments]); // eslint-disable-line

  return (
    <>
      {blocks.map((spendingBlock, index) => {
        return (
          <Grid.Col key={spendingBlock.start}>
            <Card>
              <Card.Header>
                <div className="col-1">
                  <input
                    className="align-middle mx-1"
                    type="checkbox"
                    value=""
                    checked={spendingBlock.active}
                    onChange={({ currentTarget }) => {
                      spendingBlock.active = currentTarget.checked;
                      const newQ = [...blocks];
                      newQ[index] = spendingBlock;
                      setBlocks(newQ);
                    }}
                  />
                </div>
                <div
                  className={`col text-center ${styles.spendingBlocksHeader}`}
                  onClick={() => props.renderTable(spendingBlock.tasks)}
                >
                  {`Q${spendingBlock.start.quarter()}-${spendingBlock.start.format(
                    'YY'
                  )} / ${spendingBlock.tasks.length} certifications`}
                </div>
              </Card.Header>
              <Card.Body>
                <Header.H3 className="text-center">
                  {`€${Math.round(spendingBlock.spent).toLocaleString()}`}
                </Header.H3>
              </Card.Body>
            </Card>
          </Grid.Col>
        );
      })}
      <TotalSpending spendingBlocks={blocks} renderTable={props.renderTable} />
    </>
  );
}

const findRange = (howMany: number, sDate?: any): SpendingBlock => {
  let start = sDate ? dayjs(sDate) : dayjs().subtract(4, 'quarter');
  const q = start.add(howMany, 'quarter');
  return {
    start: q.startOf('quarter'),
    end: q.endOf('quarter'),
    spent: 0,
    tasks: [],
    active: true,
  };
};

const findSpecificRanges = (
  startDate: string,
  endDate: string
): SpendingBlock[] => {
  let ranges: SpendingBlock[] = [];
  let i = 1;
  const sDate = dayjs(startDate);
  const eDate = dayjs(endDate);

  // checking if startDate is a start of its range
  if (sDate.isSame(sDate.startOf('quarter'), 'day')) {
    ranges.push({
      start: sDate.startOf('quarter'),
      end: sDate.endOf('quarter'),
      spent: 0,
      tasks: [],
      active: true,
    });
  }

  while (sDate.add(i, 'quarter').endOf('quarter') < eDate) {
    ranges.push(findRange(i++, startDate));
  }

  // checking if endDate is an end of its range
  if (sDate.add(i, 'quarter').endOf('quarter').isSame(eDate, 'day')) {
    ranges.push({
      start: sDate.add(i, 'quarter').startOf('quarter'),
      end: sDate.add(i, 'quarter').endOf('quarter'),
      spent: 0,
      tasks: [],
      active: true,
    });
  }

  return ranges;
};

function applyPaymentsToSpendingBlocksAndPutAssociatedTasks(
  spendingBlocks: SpendingBlock[],
  payments: Payments,
  tasks: any[]
) {
  const newBlocks: SpendingBlock[] = spendingBlocks.map((spendingBlock) => ({
    ...spendingBlock,
    spent: 0,
    tasks: [],
  }));
  for (const task of tasks) {
    const paymentsPerTask = payments[task.id];
    if (!paymentsPerTask) continue;
    for (const { price } of paymentsPerTask) {
      Object.values(newBlocks).forEach((spendingBlock) => {
        if (
          spendingBlock.start < dayjs(task.createdDate) &&
          spendingBlock.end > dayjs(task.createdDate)
        ) {
          spendingBlock.spent += +price;
          !spendingBlock.tasks.find(({ id }) => id === task.id) &&
            spendingBlock.tasks.push(task);
        }
      });
    }
  }
  return newBlocks;
}

export default SpendingBlocks;
