import { Grid, Card, Header } from 'tabler-react';
import React from 'react';
import dayjs from 'dayjs';
import { start } from 'repl';


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

  findQRange(toSub: number) {
    // @ts-ignore
    const q = dayjs().subtract(toSub, 'quarter');
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
        quarters[i] = this.findQRange(i++);
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
      Object.entries(quarters).forEach(entry => {
        const [_, quarter ]: any = entry;
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
    return Object.values(this.state.quarters).reverse().map((quarter: any) => {
      return <Grid.Col width={2} key={quarter.start}>
        <Card title={`Q${quarter.start.quarter()} spendings (${quarter.start.format('MM.YYYY')} - ${quarter.end.format('MM.YYYY')})`}
          body={<>
            <Header.H5 className="display-5 text-center">
              {`€${Math.round(quarter.spent).toLocaleString()}`}
            </Header.H5>
          </>} />
      </Grid.Col>
    })
  }
}

export { QSpending }