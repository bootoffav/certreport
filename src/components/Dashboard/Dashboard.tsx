import React from 'react';
import { Grid, Card, StatsCard, Header } from 'tabler-react';
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
    const comparingDate = new Date(
      filterParam === 'CREATED_DATE'
        ? task[filterParam]
        : task.state[filterParam]
    );

    return startDate < comparingDate && endDate > comparingDate
  });

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
          <Grid.Col md={5}>
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
            <Grid.Row>
              {/* <Grid.Col>
                <CompletedCertifications
                  tasks={this.props.tasks}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                />
              </Grid.Col> */}
              <Grid.Col>
                <StartedCertifications
                  tasks={this.props.tasks}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                />
              </Grid.Col>
              <Grid.Col>
                <AmountSpent
                  tasks={this.props.tasks}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                />
              </Grid.Col>
            </Grid.Row>
          </Grid.Col>
        </Grid.Row>
      </>
    );
  }
}

interface ICardProps {
  tasks: any[];
  startDate?: Date;
  endDate?: Date;
}


class CompletedCertifications extends React.Component<ICardProps> {

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
    return <StatsCard
      layout={1}
      movement={this.movement}
      total={<div className="display-4">{this.completedCerts}</div> }
      label="Completed certifications"
    />
  }
}

class StartedCertifications extends React.Component<ICardProps> {
  
  get ongoingCerts() {
    return tasksInRange(this.props.tasks, 'CREATED_DATE', this.props.startDate, this.props.endDate).length;
  }

  get movement() {
    const tasksBeforePeriod = tasksInRange(this.props.tasks, 'CREATED_DATE', new Date('December 17, 2010 03:24:00'), this.props.endDate).length;

    return (this.ongoingCerts * 100 / tasksBeforePeriod).toFixed(2);
  }

  render() {
    return <StatsCard
      layout={1}
      movement={this.movement}
      total={<div className="display-4">{this.ongoingCerts}</div> }
      label="New Certifications"
    />
    }
  }
  
class AmountSpent extends React.Component<ICardProps> {

  get spent() {
    let spent = 0;
    let tasks = this.props.startDate || this.props.endDate
      ? tasksInRange(this.props.tasks, 'CREATED_DATE', this.props.startDate, this.props.endDate)
      : this.props.tasks;
    
    tasks.forEach(({ state }: any) => {
      spent += +state.price;
    });

    return spent ? `$${spent.toFixed(2)}` : 'could not count';
  }

  render = () => 
    <Card
      body={<>
        <Header.H5 className="text-center">Spent this period</Header.H5>
        <div className="display-4 text-center">{this.spent}</div>
      </>
    }/>
}

export default Dashboard;