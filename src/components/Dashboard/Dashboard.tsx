import React from 'react';
import { Grid, Card, StatsCard } from 'tabler-react';
import { Doughnut } from 'react-chartjs-2';
import { getData } from './dataprocessing';
import { doughnutConf } from './configs';
import { DateFilter } from '../Filters';
import "tabler-react/dist/Tabler.css";

interface IDashboard {
  tasks: any;
  startDate?: Date;
  endDate?: Date;
}

function tasksInRange(tasks: any[], filterParam: string, startDate?: Date, endDate?: Date) {
  if (startDate === undefined || endDate === undefined) return tasks;

  const tasksInRange = tasks.filter(task => {
    const comparingDate = new Date(filterParam === 'certReceivedOnRealDate' ? task.state[filterParam] : task[filterParam]);
    return startDate < comparingDate && endDate > comparingDate
  });
  debugger;
  return tasksInRange;
}


class Dashboard extends React.Component<{ tasks: any; }, IDashboard> {
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

  render() {
    return (
      <>
        <Grid.Row cards deck>
          <Grid.Col width={4} offset={4}>
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
          <Grid.Col md={6}>
            <CompletedCertifications
              tasks={this.props.tasks}
              startDate={this.state.startDate}
              endDate={this.state.endDate}
            />
            {/* <StatsCard layout={2} movement={5} total="423" label="Completed certifications" /> */}
            {/* <StatsCard layout={2} movement={5} total="423" label="Completed certifications" /> */}
            {/* <StatsCard layout={2} movement={5} total="423" label="Completed certifications" /> */}
          </Grid.Col>
        </Grid.Row>
      </>
    );
  }
}

class CompletedCertifications extends React.Component<{
  tasks: any[];
  startDate?: Date;
  endDate?: Date;
}> {

  get completedCerts() {
    const tasks = tasksInRange(
      this.props.tasks,
      'certReceivedOnRealDate',
      this.props.startDate,
      this.props.endDate
    );

    return tasks.length;
  }
  
  get movement() {
    const inRange = tasksInRange(
      this.props.tasks,
      'certReceivedOnRealDate',
      this.props.startDate,
      this.props.endDate
    ).length;
    const totalCerts = tasksInRange(
      this.props.tasks,
      'certReceivedOnRealDate',
    ).length;

    return (inRange * 100 / totalCerts).toFixed(2);
  }

  render() {
    return <StatsCard layout={2} movement={this.movement} total={this.completedCerts} label="Completed certifications" />
  }
}

export default Dashboard;