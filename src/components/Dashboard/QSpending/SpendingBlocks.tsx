import { Grid, Card, Header } from 'tabler-react';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import styles from './SpendingBlocks.module.css';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { TaskState, Payment } from 'Task/Task.interface';
import TotalSpending from './TotalSpending';
import {
  changeActiveSpendingBlocksTasks,
  IDashboardSlice,
} from 'store/slices/dashboardSlice';
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
  const { startDate, endDate, tasks, timePeriod } = useAppSelector(
    ({ main: { startDate, endDate, filteredTasks }, dashboard }) => ({
      startDate,
      endDate,
      tasks: filteredTasks,
      timePeriod: dashboard.spendingBlocksTimePeriod,
    })
  );

  const [blocks, setBlocks] = useState(
    [
      findRange(0, timePeriod),
      findRange(1, timePeriod),
      findRange(2, timePeriod),
      findRange(3, timePeriod),
    ] // default last 4 blocks as quarters
  );

  useEffect(() => {
    const blocks =
      startDate && endDate
        ? findSpecificRanges(startDate, endDate, timePeriod)
        : [
            findRange(0, timePeriod),
            findRange(1, timePeriod),
            findRange(2, timePeriod),
            findRange(3, timePeriod),
          ];
    const spendingBlocks = roundToCents(
      applyPaymentsToSpendingBlocksAndPutAssociatedTasks(blocks, tasks)
    );
    setBlocks(spendingBlocks);
  }, [startDate, endDate, tasks, timePeriod]);

  useEffect(() => {
    const tasksOfActiveSpendingBlocks = blocks
      .filter(({ active }) => active)
      .reduce<SpendingBlock['tasks']>(
        (acc, { tasks }) => acc.concat(tasks),
        []
      );
    dispatch(changeActiveSpendingBlocksTasks(tasksOfActiveSpendingBlocks));
  }, [dispatch, blocks]);

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
                  {formatSpendingBlockHeader(spendingBlock, timePeriod)}
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

function formatSpendingBlockHeader(
  { start, tasks }: SpendingBlock,
  timePeriod: IDashboardSlice['spendingBlocksTimePeriod']
): string {
  let header: string;
  switch (timePeriod) {
    case 'month':
      header = `${start.format('MM.YY')}`;
      break;
    case 'quarter':
      header = `Q${start.quarter()}-${start.format('YY')}`;
      break;
    case 'year':
      header = start.year().toString();
      break;
  }
  return `${header} / ${tasks.length} certifications`;
}

const findRange = (
  howMany: number,
  unit: IDashboardSlice['spendingBlocksTimePeriod'],
  sDate?: string
): SpendingBlock => {
  let start: dayjs.Dayjs;

  start = sDate ? dayjs(sDate) : dayjs().subtract(3, unit);
  const block = start.add(howMany, unit);
  return {
    start: block.startOf(unit),
    end: block.endOf(unit),
    spent: 0,
    tasks: [],
    active: true,
  };
};

const findSpecificRanges = (
  startDate: string,
  endDate: string,
  timePeriod: IDashboardSlice['spendingBlocksTimePeriod']
): SpendingBlock[] => {
  let ranges: SpendingBlock[] = [];
  let i = 1;
  const sDate = dayjs(startDate);
  const eDate = dayjs(endDate);

  // checking if startDate is a start of its range
  if (sDate.isSame(sDate.startOf(timePeriod), 'day')) {
    ranges.push({
      start: sDate.startOf(timePeriod),
      end: sDate.endOf(timePeriod),
      spent: 0,
      tasks: [],
      active: true,
    });
  }

  while (sDate.add(i, timePeriod).startOf(timePeriod) < eDate) {
    ranges.push(findRange(i++, timePeriod, startDate));
  }

  // checking if endDate is an end of its range
  if (sDate.add(i, timePeriod).endOf(timePeriod).isSame(eDate, 'day')) {
    ranges.push({
      start: sDate.add(i, timePeriod).startOf(timePeriod),
      end: sDate.add(i, timePeriod).endOf(timePeriod),
      spent: 0,
      tasks: [],
      active: true,
    });
  }

  return ranges;
};

function applyPaymentsToSpendingBlocksAndPutAssociatedTasks(
  spendingBlocks: SpendingBlock[],
  tasks: TaskState[]
) {
  const newBlocks: SpendingBlock[] = spendingBlocks.map((spendingBlock) => ({
    ...spendingBlock,
    spent: 0,
    tasks: [],
  }));
  for (const task of tasks) {
    Object.values(newBlocks).forEach((spendingBlock) => {
      if (
        spendingBlock.start < dayjs(task.createdDate) &&
        spendingBlock.end > dayjs(task.createdDate)
      ) {
        !spendingBlock.tasks.find(({ id }) => id === task.id) &&
          spendingBlock.tasks.push(task); // Adds task to current spendingBlock task array
        (task.state.payments as Payment[])?.forEach(
          ({ price }) => (spendingBlock.spent += +price)
        );
      }
    });
  }
  return newBlocks;
}

export default SpendingBlocks;
