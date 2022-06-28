import { Grid, Card, Header } from 'tabler-react';
import { Quarter } from './QSpending';

function TotalSpending({ quarters }: { quarters: Quarter[] }) {
  return quarters.length ? (
    <Grid.Col width={3} key="total">
      <Card>
        <Card.Header>
          <div className="form-check form-check-inline"></div>
          <div className="mx-auto quarterHeader">
            {quarters[0]?.start.format('MM.YY')} -{' '}
            {quarters.at(-1)?.end.format('MM.YY')} /{' '}
            {quarters.reduce((acc, { tasks }) => acc + tasks.length, 0)}{' '}
            certifications
          </div>
        </Card.Header>
        <Card.Body>
          <Header.H3 className="text-center">
            <div>
              TOTAL: €
              {Math.round(
                quarters.reduce((acc, quarter) => acc + quarter.spent, 0)
              ).toLocaleString()}
            </div>
          </Header.H3>
        </Card.Body>
      </Card>
    </Grid.Col>
  ) : (
    <></>
  );
}

export default TotalSpending;
