import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';
import ReactTable from "react-table";
import { Grid, Card } from 'tabler-react';
import { Doughnut } from 'react-chartjs-2';
import { DateFilter } from '../Filters';
import { doughnutOptions } from './configs';
import { getData } from './dataprocessing';
import { AmountOfCertifications, AmountSpent, CompletedCertifications, Products } from './StatCards';
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

  dateFilter = (startDate: Date | null, endDate: Date | null): void => {
    if (startDate === null || endDate === null) {
      return;
    }

    this.setState({
      tasks: tasksInRange(this.props.tasks, 'CREATED_DATE', startDate, endDate),
      startDate, endDate
    });
  }

  get byStages() {
    return getData(this.state.tasks, 'byStages');
  }

  render() {
    return (
      <Grid>
          <Grid.Row>
            <Grid.Col width={4} offset={4}>
              <Card body={ <DateFilter filter={this.dateFilter} /> }/>
            </Grid.Col>
          </Grid.Row>
          <Grid.Row cards deck>
            <Grid.Col md={5}>
              <Card
                title="Task by stages"
                body={
                  <Doughnut
                    data={this.byStages}
                    options={{
                      ...doughnutOptions,
                      onClick: (_: MouseEvent, chartElement: any) => {
                        const { _model: { label: stage } } = chartElement.pop();
                        this.renderTableOfDiagramSegment(stage);
                      }
                    }}
                  />
                }
              />
            </Grid.Col>
            <Grid.Col md={7}>
              <Grid.Row>
                <StatCardsContext.Provider value={{
                  tasks: this.props.tasks,
                  startDate: this.state.startDate,
                  endDate: this.state.endDate,
                }}>
                  <Grid.Col><CompletedCertifications /></Grid.Col>
                  <Grid.Col><AmountOfCertifications /></Grid.Col>
                  <Grid.Col><AmountSpent /></Grid.Col>
                  <Grid.Col><Products /></Grid.Col>
                </StatCardsContext.Provider>
              </Grid.Row>
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

  get columns() {
    return getColumns(0, undefined);
  }

  renderTableOfDiagramSegment(stage: string) {

    const data = this.state.tasks.filter(t => t.state.stage === stage);

    render(
      <BrowserRouter>
        <ReactTable
          data={data}
          columns={this.columns}
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