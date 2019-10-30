import React from 'react';
import { Grid, Card } from 'tabler-react';
import { Doughnut } from 'react-chartjs-2';
import { getData } from './dataprocessing';
import { doughnutConf } from './configs';
import { DateFilter } from '../Filters';

class Dashboard extends React.Component<{ tasks: any; }> {
  state = {
    tasks: this.props.tasks
  }

  dateFilter = (startDate: Date | null, endDate: Date | null): void => {
    let tasksForUpdate: any;
    if (startDate === null || endDate === null) {
      tasksForUpdate = this.state.tasks;
    } else {
      tasksForUpdate = this.state.tasks.filter((task: any) => {
        const comparingDate = new Date(task.CREATED_DATE);
        return startDate < comparingDate && endDate > comparingDate
      });
    }

    this.setState({
      tasks: tasksForUpdate, startDate, endDate
    });
  }
  
  render() {
    return (
      <>
        <Grid.Row cards deck>
          <Grid.Col width={4}>
            <Card body={ <DateFilter filter={this.dateFilter} /> }/>
          </Grid.Col>

        </Grid.Row>
        <Grid.Row cards deck>
          <Grid.Col md={6}>
            <Card
              title={<div className="text-center">Tasks by stages</div>}
              body={
                <Doughnut
                  data={() => getData(this.state.tasks, 'byStages')}
                  options={doughnutConf.options}
                />
              }
            />
          </Grid.Col>
        </Grid.Row>
      </>
    );
  }
}

export default Dashboard;