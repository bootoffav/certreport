import { Grid, Card, Header } from 'tabler-react';
import React from 'react';
import dayjs from 'dayjs';
import './QSpending.css';


dayjs.extend(require('dayjs/plugin/quarterOfYear'));


class QSpending extends React.Component<{
  renderTable: (t: any[]) => void;
  saveTotal: (total: number) => void;
  tasks: any;
  startDate?: Date;
  endDate?: Date;
}> {

  spendings: any = {};
  state: {
    tasksByQuarters?: any;
    quarters: any;
  }

  constructor(props: any) {
    super(props);
    //найдем полные кварталы
    let quarters = this.findQuarters();
    //привяжем суммы трат
    quarters = this.countQuarterSpendings(quarters);
    this.props.saveTotal(
      Math.round(
        Object.values(quarters)
          .reduce((acc: number, quarter: any) => acc + quarter.spent, 0)
      )
    );
    this.state = { quarters };
  }

  findQRange(toSub: number, endDate?: Date) {
    // @ts-ignore
    const q = dayjs(endDate).subtract(toSub, 'quarter');
    return {
      // @ts-ignore
      start: q.startOf('quarter'), end: q.endOf('quarter'),
      spent: 0, tasks: []
    }
  }

    //  находит целые кварталы
    findQuarters(startDate?: Date, endDate?: Date) {
        var quarters: any = {};
        if (startDate && endDate) {
            const end = dayjs(endDate);
            let i = 1;
            
            // @ts-ignore
            while (end.subtract(i, 'quarter').startOf('quarter') >= dayjs(startDate)) {
                quarters[i] = this.findQRange(i++, endDate);
            }
            // checking if endDate is an end of a current quarter
            // @ts-ignore
            if (dayjs(endDate).isSame(end.endOf('quarter'), 'day')) {
                quarters[i] = {
                    // @ts-ignore
                    start: dayjs(endDate).startOf('quarter'), end: dayjs(endDate).endOf('quarter'),
                    spent: 0, tasks: []
                }
            }

            return quarters;
        }

        // last for 4 quarters from today
        return {
            1: this.findQRange(4),
            2: this.findQRange(3),
            3: this.findQRange(2),
            4: this.findQRange(1),
        }
    }

  // считает траты целых кварталов
    countQuarterSpendings(quarters: any) {
        this.props.tasks.forEach((task: any) => {
            const { price, paymentDate } = task.state;
            Object.entries(quarters).forEach(([_, quarter]: any) => {
                if (quarter.start < dayjs(paymentDate) && dayjs(paymentDate) < quarter.end) {
                    quarter.spent += +price;
                    quarter.tasks.push(task);
                }
            });
        });
        return quarters;
    }

    componentDidUpdate(prevProps: any) {
        const { startDate: prevStart, endDate: prevEnd, tasks: prevTasks } = prevProps;
        const { startDate, endDate } = this.props;
        if (prevStart !== startDate || prevEnd !== endDate || prevTasks !== this.props.tasks) {
            let quarters = this.findQuarters(startDate, endDate);
            quarters = this.countQuarterSpendings(quarters);
            this.setState({ quarters, startDate, endDate });
            this.props.saveTotal(
                Math.round(
                    Object.values(quarters)
                        .reduce((acc: number, quarter: any) => acc + quarter.spent, 0)
                )
            );
        }
    }

    render() {
        return Object.values(this.state.quarters).map((quarter: any) => {
            return <Grid.Col width={2} key={quarter.start}>
                <Card>
                <Card.Header>
                    <div className="mx-auto quarterHeader" onClick={() => this.props.renderTable(quarter.tasks)}>
                    {`Q${quarter.start.quarter()}-${quarter.start.format('YY')}`}
                    </div>
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

export { QSpending };