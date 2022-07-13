import { Grid, Card, Header } from 'tabler-react';
import { QSpendingProps, Quarter } from './QSpending';
import styles from './QSpending.module.css';

function TotalSpending({
  quarters,
  renderTable,
}: {
  quarters: Quarter[];
  renderTable: QSpendingProps['renderTable'];
}) {
  if (quarters.length) {
    const activeQuarters = quarters.filter((q) => q.active);
    const tasks = activeQuarters.reduce(
      (acc, { tasks }) => [...acc, ...tasks],
      [] as any[]
    );
    return (
      <Grid.Col width={3} key="total">
        <Card>
          <Card.Header>
            <div className="form-check form-check-inline"></div>
            <div
              className={`mx-auto ${styles.quarterHeader}`}
              onClick={() => renderTable(tasks)}
            >
              {quarters[0]?.start.format('MM.YY')} -{' '}
              {quarters.at(-1)?.end.format('MM.YY')} / {tasks.length}{' '}
              certifications
            </div>
          </Card.Header>
          <Card.Body>
            <Header.H3 className="text-center">
              <div>
                TOTAL: €
                {Math.round(
                  activeQuarters.reduce((acc, { spent }) => acc + spent, 0)
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
