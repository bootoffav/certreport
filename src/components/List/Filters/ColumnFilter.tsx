import * as React from 'react';

class ColumnFilter extends React.Component<{
    tasks: any;
    requiredStage?: string;
    update: any;
    allProducts: any;
    value: string;
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

    filter(searchVal: string, columnToSearch: string) {
        let visibleData;
        const searchValOrig = searchVal;
        searchVal = searchVal.toLowerCase();
        if (this.props.requiredStage === 'products') {
            visibleData = this.props.allProducts.filter((product: any) => {
                if (columnToSearch === 'article') {
                    return product[columnToSearch].toLowerCase().includes(searchVal)
                } else {
                    return product[columnToSearch].join(', ').toLowerCase().includes(searchVal);
                }
            });
        } else {
            visibleData = this.props.tasks.filter((task: any) => columnToSearch === 'TITLE'
                ? task[columnToSearch].toLowerCase().includes(searchVal)
                : task.state[columnToSearch].toLowerCase().includes(searchVal)
            );
        }

        this.props.update({
            visibleData,
            columnFilterValue: searchValOrig,
            stage: 'all',
            startDate: undefined,
            endDate: undefined
        });
    }

  onChange = ({ currentTarget }: React.SyntheticEvent) => {
    const value = (currentTarget as HTMLInputElement).value;
    this.filter(value, this.state.searchingColumn);
  };

  render = () => {
    const prop = this.props.requiredStage === 'products' ? 'products' : 'default';
    return <div className="mr-1 input-group">
      <input type="text" className="form-control" placeholder="search"
        onChange={this.onChange} value={this.props.value} />
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

export default ColumnFilter;