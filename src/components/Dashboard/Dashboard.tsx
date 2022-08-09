import './Dashboard.css';
import { Grid } from 'tabler-react';
import BrandChart from './BrandCharts/BrandChart';
import SpendingBlocks from './SpendingBlocks/SpendingBlocks';
import CertificationsResultCard from './CertificationsResultCard';
import { useAppSelector } from 'store/hooks';
import { useEffect } from 'react';

function Dashboard() {
  const activeBrands = useAppSelector(({ main }) => main.activeBrands);

  useEffect(() => {
    return () => console.log('changed');
  }, [activeBrands]);

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
          <div id="tableOfDiagramSegment"></div>
        </Grid.Col>
      </Grid.Row>
    </>
  );
}

export default Dashboard;
