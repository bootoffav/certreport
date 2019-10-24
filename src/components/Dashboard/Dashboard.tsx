import React from 'react';
import { AppContext } from '../../AppState';
import { Grid, Card } from 'tabler-react';
import { Doughnut } from 'react-chartjs-2';
import { getData } from './dataprocessing';
import { doughnutConf } from './configs';

class Dashboard extends React.Component {
  static contextType = AppContext;
  render() {
    return (
      <div className="mt-1">
        <div className="d-flex justify-content-center mb-1">
          <Grid.Row cards deck>
            <Grid.Col md={2}>
              <Card body={1}/>
            </Grid.Col>
            <Grid.Col md={2}>
              <Card body="2"/>
            </Grid.Col>
            <Grid.Col md={2}>
              <Card body="3" />
            </Grid.Col>
            <Grid.Col md={2}>
              <Card body="3" />
            </Grid.Col>
            <Grid.Col md={2}>
              <Card body="3" />
            </Grid.Col>
          </Grid.Row>
        </div>

        <Grid.Row cards deck>
          <Grid.Col md={4}>
            <Card
              title={<div className="text-center">Tasks by stages</div>}
              body={
                <Doughnut
                  data={() => getData(this.context.allTasks, 'byStages')}
                  options={doughnutConf.options}
                />
              }
            />
          </Grid.Col>
          <Grid.Col md={4}>
            <Card
              body="2"
            />
          </Grid.Col>
          <Grid.Col md={4}>
            <Card body="3" />
          </Grid.Col>
        </Grid.Row>
      </div>
    );
  }
}

export default Dashboard;