import * as React from 'react';

class ColumnFilter extends React.Component<{
  tasks: any;
  requiredStage?: string;
  update: any;
  allProducts: any;
  value: string;
}> {
  static getDerivedStateFromProps(props: any, state: any) {
    if (
      props.requiredStage === 'products' &&
      state.searchingColumn === 'title'
    ) {
      return {
        searchingColumn: 'article',
      };
    }

    return null;
  }

  state = {
    searchingColumn: 'title',
  };

  filter(searchVal: string, columnToSearch: string) {
    let visibleData;
    const searchValOrig = searchVal;
    searchVal = searchVal.toLowerCase();
    if (this.props.requiredStage === 'products') {
      visibleData = this.props.allProducts.filter((product: any) => {
        if (columnToSearch === 'article') {
          return product[columnToSearch].toLowerCase().includes(searchVal);
        } else {
          return product[columnToSearch]
            .join(', ')
            .toLowerCase()
            .includes(searchVal);
        }
      });
    } else {
      visibleData = this.props.tasks.filter((task: any) =>
        columnToSearch === 'title'
          ? task[columnToSearch].toLowerCase().includes(searchVal)
          : task.state[columnToSearch].toLowerCase().includes(searchVal)
      );
    }

    this.props.update({
      visibleData,
      columnFilterValue: searchValOrig,
      stage: 'all',
      startDate: undefined,
      endDate: undefined,
    });
  }

  onChange = ({ currentTarget }: React.SyntheticEvent) => {
    const value = (currentTarget as HTMLInputElement).value;
    this.filter(value, this.state.searchingColumn);
  };

  render = () => {
    const searchOptions: { [key: string]: any } = {
      default: {
        title: 'Task',
        testReport: 'Test report',
        certificate: 'Certificate',
        standards: 'Standards',
        article: 'Article',
      },
      products: {
        article: 'Fabric',
        standards: 'Standards',
      },
    };
    const prop =
      this.props.requiredStage === 'products' ? 'products' : 'default';
    return (
      <div className="mr-1 input-group">
        <input
          type="text"
          className="form-control"
          placeholder="search"
          onChange={this.onChange}
          value={this.props.value}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-success dropdown-toggle"
            id="columnSearch"
            data-toggle="dropdown"
          >
            {searchOptions[prop][this.state.searchingColumn]}
          </button>
          <div className="dropdown-menu">
            {Object.entries(searchOptions[prop]).map(([key, value]: any) => (
              <button
                key={key}
                className="dropdown-item"
                data-columnsearch={key}
                onClick={(e) =>
                  this.setState({
                    searchingColumn: e.currentTarget.dataset.columnsearch,
                  })
                }
              >
                {value}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
}

export default ColumnFilter;
