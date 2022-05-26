import { Grid, Card, Header } from 'tabler-react';
import { Component, useEffect } from 'react';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import './QSpending.css';
import { getTotalPriceHelper } from 'helpers';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

dayjs.extend(quarterOfYear);

interface ITotalQuarterSpent {
  start: string;
  end: string;
  amount: number;
  active: boolean;
}

interface QSpendingProps {
  updateQuarters: (quarters: any) => void;
  renderTable: (t: any[]) => void;
  tasks: any;
  startDate?: Date;
  endDate?: Date;
}

function QSpending(props: QSpendingProps) {
  const startDate = useSelector(({ main }: RootState) => {
    return main.startDate ? new Date(main.startDate) : undefined;
  });

  const endDate = useSelector(({ main }: RootState) => {
    return main.endDate ? new Date(main.endDate) : undefined;
  });

  const findQuarter = (howMany: number) => {
    let start = startDate ? dayjs(startDate) : dayjs().subtract(4, 'quarter');
    const q = start.add(howMany, 'quarter');
    return {
      start: q.startOf('quarter'),
      end: q.endOf('quarter'),
      spent: 0,
      tasks: [],
      active: false,
    };
  };

  // находит целые кварталы
  const findQuarters = () => {
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
          active: false,
        });
      }

      while (start.add(i, 'quarter').endOf('quarter') < end) {
        quarters.push(this.findQuarter(i++));
      }

      // checking if endDate is an end of its quarter
      if (start.add(i, 'quarter').endOf('quarter').isSame(end, 'day')) {
        quarters.push({
          start: start.add(i, 'quarter').startOf('quarter'),
          end: start.add(i, 'quarter').endOf('quarter'),
          spent: 0,
          tasks: [],
          active: false,
        });
      }

      return quarters;
    }

    // last for 4 quarters from today
    return [findQuarter(0), findQuarter(1), findQuarter(2), findQuarter(3)];
  };

  // считает траты кварталов и привязываем задачи
  const countQuarterSpendings = (quarters: any) => {
    props.tasks.forEach((task: any) => {
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
  };

  // state: {
  //   tasksByQuarters?: any;
  //   quarters: any;
  // };

  //найдем полные кварталы
  let quarters = findQuarters();
  //привяжем суммы трат
  quarters = countQuarterSpendings(quarters);
  // debugger;

  useEffect(() => {
    console.log('QSpending updated');
  });

  // const { start, end } = this.getFirstLastTotalSpendingsMonths(quarters);

  // this.state = {
  //   quarters,
  // };

  // componentDidUpdate(prevProps: any) {
  //   const {
  //     startDate: prevStart,
  //     endDate: prevEnd,
  //     tasks: prevTasks,
  //   } = prevProps;
  //   const { startDate, endDate } = this.props;
  //   if (
  //     prevStart !== startDate ||
  //     prevEnd !== endDate ||
  //     prevTasks !== this.props.tasks
  //   ) {
  //     let quarters = this.findQuarters(startDate, endDate);
  //     quarters = this.countQuarterSpendings(quarters);
  //     const { start, end } = this.getFirstLastTotalSpendingsMonths(quarters);

  //     this.setState(
  //       {
  //         quarters,
  //         startDate,
  //         endDate,
  //         total: {
  //           start,
  //           end,
  //           amount: this.countTotalSpendings(quarters),
  //         },
  //       },
  //       () => {
  //         this.props.updateQuarters({ quarters: this.state.quarters });
  //       }
  //     );
  //   }
  // }

  // getFirstLastTotalSpendingsMonths(quarters: any) {
  //   // when date range is shorter than a quarter
  //   if (quarters.length === 0) {
  //     return { start: '', end: '' };
  //   }
  //   const start = `${quarters[0].start.format('MM.YYYY')}`;
  //   const end = `${quarters[quarters.length - 1].end.format('MM.YYYY')}`;

  //   return { start, end };
  // }

  return quarters.map((quarter: any, index: number) => {
    return (
      <Grid.Col key={quarter.start}>
        <Card>
          <Card.Header>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="checkbox"
                checked={quarter.active}
                onChange={({ currentTarget }) => {
                  this.setState(
                    (state: any) => {
                      state.quarters[index].active = currentTarget.checked;
                      return { quarters: state.quarters };
                    },
                    () => {
                      this.props.updateQuarters({
                        quarters: this.state.quarters,
                      });
                    }
                  );
                }}
              />
            </div>
            <div
              className="mx-auto quarterHeader fix-quarter-label"
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
}

export default QSpending;
