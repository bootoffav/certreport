import { Component } from 'react';
import DatePicker from 'react-datepicker';
import { Button } from 'tabler-react';

class DateFilter extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      startDate: props.startDate,
      endDate: props.endDate,
    };
  }

  render() {
    return (
      <div className="d-flex mx-2 w-50 align-items-center">
        <div className="col">
          <DatePicker
            className="form-control"
            selected={this.state.startDate}
            dateFormat="dd.MM.yy"
            selectsStart
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={(date: Date) => this.setState({ startDate: date })}
            placeholderText="from"
            maxDate={this.state.endDate}
          />
        </div>
        <div className="col">
          <DatePicker
            className="form-control"
            selected={this.state.endDate}
            dateFormat="dd.MM.yy"
            selectsEnd
            startDate={this.state.startDate}
            endDate={this.state.endDate}
            onChange={(date: Date) => this.setState({ endDate: date })}
            placeholderText="to"
            minDate={this.state.startDate}
          />
        </div>
        <Button
          color="info"
          pill
          onClick={() =>
            this.props.update({
              startDate: this.state.startDate,
              endDate: this.state.endDate,
            })
          }
        >
          Apply Dates
        </Button>
      </div>
    );
  }
}

export default DateFilter;
