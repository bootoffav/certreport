import React from 'react';
import './Dashboard.css';
import { BrowserRouter } from 'react-router-dom';
import { render, unmountComponentAtNode } from 'react-dom';
import ReactTable from "react-table";
import { Grid, Card } from 'tabler-react';
import { Doughnut } from 'react-chartjs-2';
import DateFilter from '../List/Filters/DateFilter';
import { QSpending } from './QSpending/QSpending';
import { doughnutOptions } from './configs';
import { byStages, byProducts } from './dataprocessing';
import { AmountOfCertifications, AmountSpent, CompletedCertifications } from './StatCards';
import { getColumns } from '../List/columns';

interface IDashboard {
  tasks: any;
  startDate?: Date;
  endDate?: Date;
  quarterSpendingsTotal: number;
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
        endDate: undefined,
        quarterSpendingsTotal: 0
    }

    componentDidUpdate(prevProps: any, prevState: any) {
        if (prevProps.tasks !== this.props.tasks) {
            this.setState({
                tasks: this.props.tasks
            });

            const tableSegment = document.getElementById('tableOfDiagramSegment');
            if (tableSegment) unmountComponentAtNode(tableSegment);
        }
    }

    dateFilter = (startDate?: Date, endDate?: Date): void => {
        var inRange;
        if (startDate && endDate) {
            inRange = tasksInRange(this.state.tasks, 'CREATED_DATE', startDate, endDate);
            this.setState({ tasks: inRange });

            const tableSegment = document.getElementById('tableOfDiagramSegment');
            if (tableSegment) unmountComponentAtNode(tableSegment);
        }
        this.setState({
            startDate,
            endDate
        });
  }

    render() {
        return (
            <Grid>
                <Grid.Row>
                    <QSpending
                        saveTotal={(quarterSpendingsTotal: number) => this.setState({ quarterSpendingsTotal })}
                        renderTable={(tasks) => this.renderTableOfDiagramSegment('', '', tasks)}
                        tasks={this.state.tasks}
                        startDate={this.state.startDate}
                        endDate={this.state.endDate}
                    />
                    <Grid.Col width={4}>
                        <DateFilter
                            filter={this.dateFilter}
                            startDate={this.state.startDate}
                            endDate={this.state.endDate}
                        />
                        <AmountSpent spent={this.state.quarterSpendingsTotal}/>
                    </Grid.Col>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Col width={5}>
                        <Card isCollapsible
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
                                    const { _model: { label: stage } } = chartElement.pop();
                                    this.renderTableOfDiagramSegment(stage, 'stage');
                                }
                                }
                            }}
                            />
                            }
                        />
                    </Grid.Col>
                    <Grid.Col width={5}>
                        <Card isCollapsible
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
                    <Grid.Col width={2}>
                        <StatCardsContext.Provider value={{
                            tasks: this.props.tasks,
                            startDate: this.state.startDate,
                            endDate: this.state.endDate,
                        }}>
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