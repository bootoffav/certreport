import { Grid, Card, Header } from 'tabler-react';
import { Component } from 'react';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import './QSpending.css';
import { getTotalPriceHelper } from '../../../helpers';

dayjs.extend(quarterOfYear);

interface ITotalQuarterSpent {
  start: string;
  end: string;
  amount: number;
}

class QSpending extends Component<{
  renderTable: (t: any[]) => void;
  tasks: any;
  startDate?: Date;
  endDate?: Date;
}> {
  state: {
    total: ITotalQuarterSpent;
    tasksByQuarters?: any;
    quarters: any;
  };

  constructor(props: any) {
    super(props);
    //найдем полные кварталы
    let quarters = this.findQuarters(this.props.startDate, this.props.endDate);
    //привяжем суммы трат
    quarters = this.countQuarterSpendings(quarters);

    const { start, end } = this.getFirstLastTotalSpendingsMonths(quarters);

    this.state = {
      quarters,
      total: {
        start,
        end,
        amount: this.countTotalSpendings(quarters),
      },
    };
  }

  findQuarter(howMany: number, startDate?: Date) {
    let start = startDate ? dayjs(startDate) : dayjs().subtract(4, 'quarter');
    const q = start.add(howMany, 'quarter');
    return {
      start: q.startOf('quarter'),
      end: q.endOf('quarter'),
      spent: 0,
      tasks: [],
    };
  }

  // находит целые кварталы
  findQuarters(startDate?: Date, endDate?: Date) {
    var quarters: any = [];
    if (startDate && endDate) {
      let i = 1;
      const start = dayjs(startDate);
      const end = dayjs(endDate);

      // checking if startDate is a start of its quarter
      if (start.isSame(start.startOf('quarter'), 'day')) {
        quarters.push({
          start: start.startOf('quarter'),
          end: start.endOf('quarter'),
          spent: 0,
          tasks: [],
        });
      }

      while (start.add(i, 'quarter').endOf('quarter') < end) {
        quarters.push(this.findQuarter(i++, startDate));
      }

      // checking if endDate is an end of its quarter
      if (start.add(i, 'quarter').endOf('quarter').isSame(end, 'day')) {
        quarters.push({
          start: start.add(i, 'quarter').startOf('quarter'),
          end: start.add(i, 'quarter').endOf('quarter'),
          spent: 0,
          tasks: [],
        });
      }

      return quarters;
    }

    // last for 4 quarters from today
    return [
      this.findQuarter(0),
      this.findQuarter(1),
      this.findQuarter(2),
      this.findQuarter(3),
    ];
  }

  // считает траты целых кварталов
  countQuarterSpendings(quarters: any) {
    this.props.tasks.forEach((task: any) => {
      const { paymentDate1 } = task.state;
      Object.entries(quarters).forEach(([_, quarter]: any) => {
        if (
          quarter.start < dayjs(paymentDate1) &&
          dayjs(paymentDate1) < quarter.end
        ) {
          quarter.spent += getTotalPriceHelper(task.state);
          quarter.tasks.push(task);
        }
      });
    });

    return quarters;
  }

  componentDidUpdate(prevProps: any) {
    const {
      startDate: prevStart,
      endDate: prevEnd,
      tasks: prevTasks,
    } = prevProps;
    const { startDate, endDate } = this.props;
    if (
      prevStart !== startDate ||
      prevEnd !== endDate ||
      prevTasks !== this.props.tasks
    ) {
      let quarters = this.findQuarters(startDate, endDate);
      quarters = this.countQuarterSpendings(quarters);
      const { start, end } = this.getFirstLastTotalSpendingsMonths(quarters);

      this.setState({
        quarters,
        startDate,
        endDate,
        total: {
          start,
          end,
          amount: this.countTotalSpendings(quarters),
        },
      });
    }
  }

  countTotalSpendings = (quarters: any) => {
    return Math.round(
      Object.values(quarters).reduce(
        (acc: number, quarter: any) => acc + quarter.spent,
        0
      )
    );
  };

  getFirstLastTotalSpendingsMonths(quarters: any) {
    // when date range is shorter than a quarter
    if (quarters.length === 0) {
      return { start: '', end: '' };
    }
    const start = `${quarters[0].start.format('MM.YYYY')}`;
    const end = `${quarters[quarters.length - 1].end.format('MM.YYYY')}`;

    return { start, end };
  }

  render() {
    const quarters = this.state.quarters.map((quarter: any) => {
      return (
        <Grid.Col key={quarter.start}>
          <Card>
            <Card.Header>
              <div
                className="mx-auto quarterHeader"
                onClick={() => this.props.renderTable(quarter.tasks)}
              >
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
      );
    });
    const total = (
      <Grid.Col width={3} key="total">
        <Card>
          <Card.Header>
            <div className="mx-auto quarterHeader">
              {this.state.total.start} - {this.state.total.end}
            </div>
          </Card.Header>
          <Card.Body>
            <Header.H3 className="text-center">
              <div>TOTAL: €{this.state.total.amount.toLocaleString()}</div>
            </Header.H3>
          </Card.Body>
        </Card>
      </Grid.Col>
    );

    quarters.push(total);
    return quarters;
  }
}

export { QSpending };
