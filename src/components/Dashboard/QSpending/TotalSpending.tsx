import { Grid, Card, Header } from 'tabler-react';
import { SpendingBlocksProps, SpendingBlock } from './SpendingBlocks';
import styles from './SpendingBlocks.module.css';
import {
  changeSpendingBlocksTimePeriod,
  IDashboardSlice,
} from 'store/slices/dashboardSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';

function TotalSpending({
  spendingBlocks,
  renderTable,
}: {
  spendingBlocks: SpendingBlock[];
  renderTable: SpendingBlocksProps['renderTable'];
}) {
  const dispatch = useAppDispatch();
  const timePeriod = useAppSelector(
    ({ dashboard }) => dashboard.spendingBlocksTimePeriod
  );

  if (spendingBlocks.length) {
    const activeBlocks = spendingBlocks.filter(({ active }) => active);
    const tasks = activeBlocks.reduce<SpendingBlock['tasks']>(
      (acc, { tasks }) => acc.concat(tasks),
      []
    );
    return (
      <Grid.Col width={3} key="total">
        <Card>
          <Card.Header>
            <div className="form-check form-check-inline"></div>
            <div
              className={`mx-auto ${styles.spendingBlocksHeader}`}
              onClick={() => renderTable(tasks)}
            >
              {spendingBlocks[0]?.start.format('MM.YY')} -{' '}
              {spendingBlocks.at(-1)?.end.format('MM.YY')} / {tasks.length}{' '}
              certifications
            </div>
            <div>
              <div>Period of time</div>
              <select
                className="text-center"
                value={timePeriod}
                onChange={({ currentTarget: { value } }) => {
                  dispatch(
                    changeSpendingBlocksTimePeriod(
                      value as IDashboardSlice['spendingBlocksTimePeriod']
                    )
                  );
                }}
              >
                {['1 month', 'quarter', '6 months', '1 year'].map((range) => (
                  <option key={range} value={range}>
                    {range}
                  </option>
                ))}
              </select>
            </div>
          </Card.Header>
          <Card.Body>
            <Header.H3 className="text-center">
              <div>
                TOTAL: €
                {Math.round(
                  activeBlocks.reduce((acc, { spent }) => acc + spent, 0)
                ).toLocaleString()}
              </div>
            </Header.H3>
          </Card.Body>
        </Card>
      </Grid.Col>
    );
  }
  return <></>;
}

export default TotalSpending;
