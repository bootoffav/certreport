import { Grid } from 'tabler-react';
import BrandChart from './BrandCharts/BrandChart';
import SpendingBlocks from './SpendingBlocks/SpendingBlocks';
import CertificationsResultCard from './CertificationsResultCard';
import { useAppSelector } from 'store/hooks';
import ReactTable from 'react-table';
import { countTotalPrice } from 'helpers';
import { getColumns } from '../Lists/Certification/columns';

function Dashboard() {
  const { activeBrands, tableTasks } = useAppSelector(
    ({ main, dashboard }) => ({
      activeBrands: main.activeBrands,
      tableTasks: dashboard.tableTasks,
    })
  );

  return (
    <>
      <Grid.Row deck>
        <Grid.Col>
          <CertificationsResultCard resume="pass" label="PASS" />
        </Grid.Col>
        <Grid.Col>
          <CertificationsResultCard resume="partly" label="PASS (Partly)" />
        </Grid.Col>
        <Grid.Col>
          <CertificationsResultCard resume="fail" label="FAIL" />
        </Grid.Col>
        <Grid.Col>
          <CertificationsResultCard resume="no sample" label="No Sample" />
        </Grid.Col>
        <Grid.Col>
          <CertificationsResultCard
            resume="allWithResults"
            label="All with results"
          />
        </Grid.Col>
      </Grid.Row>
      <Grid.Row deck>
        <SpendingBlocks />
      </Grid.Row>
      <Grid.Row>
        {activeBrands.map((brand) => (
          <Grid.Col width={12 / activeBrands.length} key={brand}>
            <BrandChart brand={brand} />
          </Grid.Col>
        ))}
      </Grid.Row>
      <Grid.Row>
        <Grid.Col>
          {tableTasks.length ? (
            <ReactTable
              data={tableTasks}
              columns={getColumns(countTotalPrice(tableTasks), undefined)}
              defaultPageSize={20}
            />
          ) : (
            ''
          )}
        </Grid.Col>
      </Grid.Row>
    </>
  );
}

export default Dashboard;
