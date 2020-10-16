import { Component, createContext } from 'react';
import './Dashboard.css';
import { BrowserRouter } from 'react-router-dom';
import { render, unmountComponentAtNode } from 'react-dom';
import ReactTable from 'react-table';
import { Grid, Card } from 'tabler-react';
import { Doughnut } from 'react-chartjs-2';
import { QSpending } from './QSpending/QSpending';
import { doughnutOptions } from './configs';
import { byStages, byProducts } from './dataprocessing';
import { AmountOfCertifications, CompletedCertifications } from './StatCards';

import { getColumns } from '../List/columns';
import { countTotalPrice } from '../../helpers';

interface IDashboard {
  tasks: any;
  startDate?: Date;
  endDate?: Date;
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
  };

  componentDidUpdate(prevProps: any, prevState: any) {
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
              />
            </Grid.Row>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row>
          <Grid.Col width={5}>
            <Card
              isCollapsible
              title="Task by stages"
              body={
                <Doughnut
                  data={byStages(this.state.tasks)}
                  options={{
                    legend: {
                      position: 'bottom',
                    },
                    onClick: (_: MouseEvent, chartElement: any) => {
                      if (chartElement.length !== 0) {
                        const {
                          _model: { label: stage },
                        } = chartElement.pop();
                        this.renderTableOfDiagramSegment(stage, 'stage');
                      }
                    },
                  }}
                />
              }
            />
          </Grid.Col>
          <Grid.Col width={5}>
            <Card
              isCollapsible
              title="Products"
              body={
                <Doughnut
                  data={byProducts(this.state.tasks)}
                  options={{
                    ...doughnutOptions,
                    onClick: (_: MouseEvent, chartElement: any) => {
                      const {
                        _model: { label: article },
                      } = chartElement.pop();
                      this.renderTableOfDiagramSegment(article, 'article');
                    },
                  }}
                />
              }
            />
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

  renderTableOfDiagramSegment(
    checkedValue: string,
    param: string,
    tasks?: any
  ) {
    if (['no product', 'no stage'].includes(checkedValue)) checkedValue = '';

    tasks =
      tasks ||
      this.state.tasks.filter((t: any) => t.state[param] === checkedValue);

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

export default Dashboard;
export const StatCardsContext = createContext({});
export { tasksInRange };
