import { Component } from 'react';
import { connect } from 'react-redux';
import './Dashboard.css';
import { unmountComponentAtNode } from 'react-dom';
import { Grid } from 'tabler-react';
// import BranchChart from './BrandCharts/BrandChart';
import SpendingBlocks from './SpendingBlocks/SpendingBlocks';
// import { chartOptions } from './configs';
import { renderTableOfDiagramSegment } from './utils';
import { CertificationsResultCard } from './CertificationsResultCard';

import { dashboardDataChartAdapter } from 'helpers';
import { RootState } from 'store/store';

interface IDashboard {
  quarters: any;
  allDataInChartsVisible: boolean;
}

function tasksInRange(
  tasks: any[],
  filterParam: string,
  startDate?: Date,
  endDate?: Date
) {
  if (startDate === undefined || endDate === undefined) return tasks;

  const tasksInRange = tasks.filter((task) => {
    const comparingDate = new Date(
      filterParam === 'CREATED_DATE'
        ? task[filterParam]
        : task.state[filterParam]
    );

    return startDate < comparingDate && endDate > comparingDate;
  });

  return tasksInRange;
}

class Dashboard extends Component<any, IDashboard> {
  state = {
    quarters: [],
    allDataInChartsVisible: true,
  };

  componentDidUpdate(prevProps: any) {
    if (prevProps.tasks !== this.props.tasks) {
      const tableSegment = document.getElementById('tableOfDiagramSegment');
      if (tableSegment) unmountComponentAtNode(tableSegment);
    }
  }

  render() {
    return (
      <>
        <Grid.Row deck>
          <SpendingBlocks
            renderTable={(tasks) =>
              renderTableOfDiagramSegment('', '', tasks, true)
            }
          />
        </Grid.Row>
        <Grid.Row>
          <Grid.Col>{/* <BranchChart brand="XMT" /> */}</Grid.Col>
          <Grid.Col>{/* <BranchChart brand="XMS" /> */}</Grid.Col>
          <Grid.Col>{/* <BranchChart brand="XMF" /> */}</Grid.Col>
          <Grid.Col width={1}>
            <CertificationsResultCard resume="pass" label="PASS" />
            <CertificationsResultCard resume="partly" label="PASS (Partly)" />
            <CertificationsResultCard resume="fail" label="FAIL" />
            <CertificationsResultCard resume="no sample" label="No Sample" />
            <CertificationsResultCard
              resume="allWithResults"
              label="All with results"
            />
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col width={12}>
            <div id="tableOfDiagramSegment"></div>
          </Grid.Col>
        </Grid.Row>
      </>
    );
  }

  onClickChartHandler = (chartElement: any, param: 'stage' | 'article') => {
    if (chartElement.length !== 0) {
      const {
        _model: { label },
      } = chartElement.pop();
      renderTableOfDiagramSegment(
        label,
        param,
        // passing specific tasks
        dashboardDataChartAdapter(
          this.state.allDataInChartsVisible
            ? this.props.tasks
            : this.state.quarters
        ),
        false
      );
    }
  };
}

export default connect(({ main }: RootState) => ({
  tasks: main.filteredTasks,
  // @ts-ignore
}))(Dashboard);

export { tasksInRange };
