import React from 'react';
import './Dashboard.css';
import { BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';
import ReactTable from "react-table";
import { Grid, Card } from 'tabler-react';
import { Doughnut } from 'react-chartjs-2';
import { DateFilter } from '../Filters';
import { QSpending } from './QSpending/QSpending';
import { doughnutOptions } from './configs';
import { byStages, byProducts } from './dataprocessing';
import { AmountOfCertifications, AmountSpent, CompletedCertifications } from './StatCards';
import { getColumns } from '../List/columns';

interface IDashboard {
  tasks: any;
  startDate?: Date;
  endDate?: Date;
}

function tasksInRange(tasks: any[], filterParam: string, startDate?: Date, endDate?: Date) {
  if (startDate === undefined || endDate === undefined) return tasks;

  const tasksInRange = tasks.filter(task => {
    const comparingDate = new Date(
      filterParam === 'CREATED_DATE'
        ? task[filterParam]
        : task.state[filterParam]
    );

    return startDate < comparingDate && endDate > comparingDate
  });

  return tasksInRange;
}

class Dashboard extends React.Component<{ tasks: any[]; }, IDashboard> {
  state = {
    tasks: this.props.tasks,
    startDate: undefined,
    endDate: undefined
  }

  dateFilter = (startDate?: Date, endDate?: Date): void => {
    this.setState({ startDate, endDate });
    if (startDate && endDate) {
      this.setState({
        tasks: tasksInRange(this.props.tasks, 'CREATED_DATE', startDate, endDate),
      });
    }
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
          <QSpending
            renderTable={(tasks) => this.renderTableOfDiagramSegment('', '', tasks)}
            tasks={this.props.tasks}
            startDate={this.state.startDate}
            endDate={this.state.endDate}
          />
          <Grid.Col width={4}>
            <Card body={ <DateFilter filter={this.dateFilter} /> }/>
          </Grid.Col>
        </Grid.Row>
        <Grid.Row></Grid.Row>
          <Grid.Row cards deck>
            <Grid.Col md={5}>
              <Card
                title="Task by stages"
                body={
                  <Doughnut
                    data={byStages(this.state.tasks)}
                    options={{
                      ...doughnutOptions,
                      onClick: (_: MouseEvent, chartElement: any) => {
                        const { _model: { label: stage } } = chartElement.pop();
                        this.renderTableOfDiagramSegment(stage, 'stage');
                      }
                    }}
                  />
                }
              />
            </Grid.Col>
            <Grid.Col md={5}>
              <Card
                title="Products"
                body={
                  <Doughnut
                    data={byProducts(this.state.tasks)}
                    options={{
                      ...doughnutOptions,
                      onClick: (_: MouseEvent, chartElement: any) => {
                        const { _model: { label: article } } = chartElement.pop();
                        this.renderTableOfDiagramSegment(article, 'article');
                      }
                    }}
                  />
                }
              />
            </Grid.Col>
            <Grid.Col md={2}>
              <StatCardsContext.Provider value={{
                  tasks: this.props.tasks,
                  startDate: this.state.startDate,
                  endDate: this.state.endDate,
              }}>
                <Grid.Row><CompletedCertifications /></Grid.Row>
                <Grid.Row><AmountOfCertifications /></Grid.Row>
                <Grid.Row><AmountSpent /></Grid.Row>
              </StatCardsContext.Provider>
            </Grid.Col>
          </Grid.Row>
        <Grid.Row>
          <Grid.Col md={12}>
            <div id="tableOfDiagramSegment"></div>
          </Grid.Col>
        </Grid.Row>
      </Grid>
    );
  }


  renderTableOfDiagramSegment(checkedValue: string, param: string, tasks?: any) {
    if (['no product', 'no stage'].includes(checkedValue)) checkedValue = '';

    tasks = tasks || this.state.tasks.filter(t => t.state[param] === checkedValue);

    const totalPrice: number = tasks.reduce(
      (sum: number, task: any) => sum + Number(task.state.price),
      0);

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
export const StatCardsContext = React.createContext({});
export { tasksInRange };