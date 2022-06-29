import { Component } from 'react';
import { connect } from 'react-redux';
import './Dashboard.css';
import { unmountComponentAtNode } from 'react-dom';
import { Grid, Card } from 'tabler-react';
import { HorizontalBar } from 'react-chartjs-2';
import QSpending from './QSpending/QSpending';
import { chartOptions } from './configs';
import { byStages, byProducts } from './dataprocessing';
import { renderTableOfDiagramSegment } from './utils';
import { CertificationsResultCard } from './StatCards';

import { dashboardDataChartAdapter } from 'helpers';
import { RootState } from 'store';

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
    totalSpendings: {
      start: '',
      end: '',
      amount: 0,
    },
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
        <Grid.Row width={12}>
          <Grid.Col>
            <Grid.Row deck>
              {/* @ts-ignore */}
              <QSpending
                renderTable={(tasks) =>
                  renderTableOfDiagramSegment('', '', tasks, true)
                }
              />
            </Grid.Row>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col width={5}>
            <Card isCollapsible>
              <Card.Header>
                <Card.Title>Task by stages</Card.Title>
              </Card.Header>
              <Card.Body>
                {/* @ts-ignore */}
                <HorizontalBar
                  data={byStages(
                    dashboardDataChartAdapter(
                      this.state.allDataInChartsVisible
                        ? this.props.tasks
                        : this.state.quarters
                    )
                  )}
                  options={{
                    ...chartOptions,
                    onClick: (_: PointerEvent, chartElement: any) =>
                      this.onClickChartHandler(chartElement, 'stage'),
                  }}
                />
              </Card.Body>
            </Card>
          </Grid.Col>
          <Grid.Col width={5}>
            <Card isCollapsible>
              <Card.Header>
                <Card.Title>Products</Card.Title>
              </Card.Header>
              <Card.Body>
                {/* @ts-ignore */}
                <HorizontalBar
                  data={byProducts(
                    dashboardDataChartAdapter(
                      this.state.allDataInChartsVisible
                        ? this.props.tasks
                        : this.state.quarters
                    )
                  )}
                  options={{
                    ...chartOptions,
                    onClick: (_: PointerEvent, chartElement: any) =>
                      this.onClickChartHandler(chartElement, 'article'),
                  }}
                />
              </Card.Body>
            </Card>
          </Grid.Col>
          <Grid.Col width={2}>
            <CertificationsResultCard resume="pass" label="PASS" />
            <CertificationsResultCard resume="partly" label="PASS (Partly)" />
            <CertificationsResultCard resume="fail" label="FAIL" />
            <CertificationsResultCard resume="" label="All" />
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
        )
      );
    }
  };
}

export default connect(({ main }: RootState) => ({
  tasks: main.filteredTasks,
  // @ts-ignore
}))(Dashboard);

export { tasksInRange };
