import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import './Filters.css';

class ColumnSearch extends React.Component<{
    requiredStage?: string;
    filter: (columnToSeach: string, valueToSearch: string) => void
  }> {

  static getDerivedStateFromProps(props: any, state: any) {
    if (props.requiredStage === 'products' && state.searchingColumn === 'TITLE') {
      return {
        searchingColumn: 'article'
      }
    }
    return null;
  }

  state = {
    value: '',
    searchingColumn: 'TITLE'
  }

  searchOptions: any = {
    default: {
      TITLE: 'Task',
      testReport: 'Test report',
      certificate: 'Certificate',
      standards: 'Standards',
      article: 'Fabric',
    },
    products: {
      article: 'Fabric',
      standards: 'Standards',
    }
  }

  onChange = ({ currentTarget }: React.SyntheticEvent) => {
    const value = (currentTarget as HTMLInputElement).value;
    this.setState({ value });
    this.props.filter(value, this.state.searchingColumn);
  };

  render = () => {
    const prop = this.props.requiredStage === 'products' ? 'products' : 'default';
    return <div className="input-group">
      <input type="text" className="form-control" placeholder="search"
        onChange={this.onChange} value={this.state.value} />
      <div className="input-group-append">
        <button
          className="btn btn-outline-success dropdown-toggle"
          id="columnSearch"
          data-toggle="dropdown"
        >{this.searchOptions[prop][this.state.searchingColumn]}</button>
        <div className="dropdown-menu">
          {Object.entries(this.searchOptions[prop]).map(entry =>
            <button
              key={entry[0]}
              className="dropdown-item"
              data-columnsearch={entry[0]}
              onClick={(e) => this.setState({ searchingColumn: e.currentTarget.dataset.columnsearch })}
            // @ts-ignore
            >{entry[1]}</button>
          )}
        </div>
      </div>
    </div>
  }
}

const BrandFilter: React.FunctionComponent<{
    filter: (e: React.SyntheticEvent<HTMLButtonElement>) => void
  }> = (props) =>
    <div className="dropdown">
      <button className="btn btn-success dropdown-toggle" type="button" id="brandFilter" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Brand: All
      </button>
      <div className="dropdown-menu">
        <button className="dropdown-item" onClick={props.filter}>All</button>
        <div className="dropdown-divider"></div>
        <button className="dropdown-item" onClick={props.filter}>XMT</button>
        <button className="dropdown-item" onClick={props.filter}>XMS</button>
        <button className="dropdown-item" onClick={props.filter}>XMF</button>
        <div className="dropdown-divider"></div>
        <button className="dropdown-item" onClick={props.filter}>No brand</button>
      </div>
    </div>

function DateFilter(
  { filter }: {
    filter: (startDate?: Date, endDate?: Date) => void;
  }) {

  const[startDate, setStartDate] = useState<Date>();
  const[endDate, setEndDate] = useState<Date>();

  return <div className="form-row" id="dateRange">
    <div className="d-flex align-items-center">
      <div className="text-uppercase">Date Filter:</div>
    </div>
    <div className="col">
      <DatePicker
        className="col form-control"
        selected={startDate}
        dateFormat="dd.MM.yyyy"
        selectsStart
        startDate={startDate}
        endDate={endDate}
        onChange={(date: Date) => {
          setStartDate(date);
          filter(date, endDate)
        }}
        placeholderText="from"
      />
    </div>
    <div className="col">
      <DatePicker
        className="col form-control"
        selected={endDate}
        dateFormat="dd.MM.yyyy"
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        onChange={(date: Date) => {
          setEndDate(date);
          filter(startDate, date)
        }}
        placeholderText="to"
        minDate={startDate}
      />
    </div>
  </div>
  }

export { ColumnSearch, BrandFilter, DateFilter };