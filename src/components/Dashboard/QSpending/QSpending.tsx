import { Grid, Card, Header } from 'tabler-react';
import React from 'react';
import dayjs from 'dayjs';
import './QSpending.css';


dayjs.extend(require('dayjs/plugin/quarterOfYear'));


class QSpending extends React.Component<{
  tasks: any;
  startDate?: Date;
  endDate?: Date;
}> {

  spendings: any = {};
  state: {
    quarters: any;
  }

  constructor(props: any) {
    super(props);
    //найдем полные кварталы
    let quarters = this.findQuarters();
    //привяжем суммы трат
    quarters = this.countQuarterSpendings(quarters);
    
    this.state = { quarters };
  }

  findQRange(toSub: number, endDate?: Date) {
    // @ts-ignore
    const q = dayjs(endDate).subtract(toSub, 'quarter');
    return {
      // @ts-ignore
      start: q.startOf('quarter'), end: q.endOf('quarter'), spent: 0
    }
  }

  //  находит целые кварталы
  findQuarters(startDate?: Date, endDate?: Date) {
    var quarters: any = {};
    if (startDate && endDate) {
      const end = dayjs(endDate);
      let i = 1;
      // @ts-ignore
      while (end.subtract(i, 'quarter').startOf('quarter') > dayjs(startDate)) {
        quarters[i] = this.findQRange(i++, endDate);
      }

      return quarters;
    }

    return {
      4: this.findQRange(4),
      3: this.findQRange(3),
      2: this.findQRange(2),
      1: this.findQRange(1),
    }
  }

  // считает траты целых кварталов
  countQuarterSpendings(quarters: any) {
    this.props.tasks.forEach((task: any) => {
      const { price, paymentDate } = task.state;
      Object.entries(quarters).forEach(([_, quarter]: any) => {
        if (quarter.start < dayjs(paymentDate) && dayjs(paymentDate) < quarter.end) {
          quarter.spent += +price;
        }
      });
    });
    return quarters;
  }

  componentDidUpdate(prevProps: any) {
    const { startDate: prevStart, endDate: prevEnd } = prevProps;
    const { startDate, endDate } = this.props;
    if (prevStart !== startDate || prevEnd !== endDate) {
      let quarters = this.findQuarters(startDate, endDate);
      quarters = this.countQuarterSpendings(quarters);
      this.setState({ quarters, startDate, endDate });
    }

  }

  render() {
    const nbsp = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
    return Object.values(this.state.quarters).reverse().map((quarter: any) => {
      return <Grid.Col width={2} key={quarter.start}>
        <Card>
          <Card.Header>
            <span dangerouslySetInnerHTML={{__html: nbsp}} />
            {`Q${quarter.start.quarter()}-${quarter.start.format('YY')}`}
          </Card.Header>
          <Card.Body>
            <Header.H3 className="text-center">
              {`€${Math.round(quarter.spent).toLocaleString()}`}
            </Header.H3>
          </Card.Body>
        </Card>
      </Grid.Col>
    })
      }
    }
    
export {QSpending}
