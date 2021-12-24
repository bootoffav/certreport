import { Component, createContext } from 'react';
import './Dashboard.css';
import { BrowserRouter } from 'react-router-dom';
import { render, unmountComponentAtNode } from 'react-dom';
import ReactTable from 'react-table';
import { Grid, Card } from 'tabler-react';
import { HorizontalBar } from 'react-chartjs-2';
import { QSpending } from './QSpending/QSpending';
import { chartOptions } from './configs';
import { byStages, byProducts } from './dataprocessing';
import { AmountOfCertifications, CompletedCertifications } from './StatCards';

import { getColumns } from '../Lists/Certification/columns';
import { countTotalPrice, dashboardDataChartAdapter } from 'helpers';

interface IDashboard {
  tasks: any;
  startDate?: Date;
  endDate?: Date;
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
    tasks: this.props.tasks,
    totalSpendings: {
      start: '',
      end: '',
      amount: 0,
    },
    startDate: undefined,
    endDate: undefined,
    quarters: [],
    allDataInChartsVisible: true,
  };

  componentDidUpdate(prevProps: any) {
    if (prevProps.tasks !== this.props.tasks) {
      this.setState({
        tasks: this.props.tasks,
      });

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
              <QSpending
                renderTable={(tasks) =>
                  this.renderTableOfDiagramSegment('', '', tasks)
                }
                tasks={this.state.tasks}
                startDate={this.props.startDate}
                endDate={this.props.endDate}
                updateQuarters={this.setState.bind(this)}
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
                <HorizontalBar
                  data={byStages(
                    dashboardDataChartAdapter(
                      this.state.allDataInChartsVisible
                        ? this.state.tasks
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
                <HorizontalBar
                  data={byProducts(
                    dashboardDataChartAdapter(
                      this.state.allDataInChartsVisible
                        ? this.state.tasks
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
            <StatCardsContext.Provider
              value={{
                tasks: this.props.tasks,
                startDate: this.state.startDate,
                endDate: this.state.endDate,
              }}
            >
              <CompletedCertifications />
              <AmountOfCertifications />
            </StatCardsContext.Provider>
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
      this.renderTableOfDiagramSegment(
        label,
        param,
        // passing specific tasks
        dashboardDataChartAdapter(
          this.state.allDataInChartsVisible
            ? this.state.tasks
            : this.state.quarters
        )
      );
    }
  };

  renderTableOfDiagramSegment(
    checkedValue: string,
    param: string,
    tasks?: any
  ) {
    if (['no product', 'no stage'].includes(checkedValue)) checkedValue = '';

    tasks = (tasks || this.state.tasks).filter(
      (t: any) => t.state[param] === checkedValue
    );

    const totalPrice = countTotalPrice(tasks);
    render(
      <BrowserRouter>
        <ReactTable
          data={tasks}
          resolveData={(data: any, i = 1) =>
            data.map((row: any) => {
              row.position = i++;
              return row;
            })
          }
          columns={getColumns(totalPrice, undefined)}
          defaultPageSize={10}
        />
      </BrowserRouter>,
      document.getElementById('tableOfDiagramSegment')
    );
  }
}

export { Dashboard };
export const StatCardsContext = createContext({});
export { tasksInRange };
