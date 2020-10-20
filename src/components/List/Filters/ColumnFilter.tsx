import * as React from 'react';

interface IColumnFilterProps {
  dataToFilter: any; // tasks or products
  requiredStage: string;
  update: any;
}

interface IColumnFilterState {
  searchByColumn: string;
  value: string;
}

const searchOptions: {
  [key: string]: any;
} = {
  default: {
    title: 'Task',
    testReport: 'Test report',
    certificate: 'Certificate',
    standards: 'Standards',
    article: 'Article',
  },
  products: {
    article: 'Article',
    standards: 'Standards',
  },
};

function filter(
  value: string,
  searchByColumn: string,
  dataToFilter: any,
  requiredStage: string
) {
  const valueLowered = value.toLowerCase();

  const filterProducts = (product: any) => {
    return searchByColumn === 'article'
      ? product.article.toLowerCase().includes(valueLowered)
      : product[searchByColumn].join(', ').toLowerCase().includes(valueLowered);
  };

  const filterTasks = (task: any) =>
    searchByColumn === 'title'
      ? task[searchByColumn].toLowerCase().includes(valueLowered)
      : task.state[searchByColumn].toLowerCase().includes(valueLowered);

  return requiredStage === 'products'
    ? dataToFilter.filter(filterProducts)
    : dataToFilter.filter(filterTasks);
}

class ColumnFilter extends React.Component<
  IColumnFilterProps,
  IColumnFilterState
> {
  constructor(props: IColumnFilterProps) {
    super(props);
    const searchByColumn =
      props.requiredStage === 'products' ? 'article' : 'title';

    this.state = {
      searchByColumn,
      value: '',
    };
  }

  componentDidUpdate(prevProps: IColumnFilterProps) {
    if (
      prevProps.requiredStage !== 'products' &&
      this.props.requiredStage === 'products'
    ) {
      this.setState({ searchByColumn: 'article' });
    }
  }

  render = () => {
    const prop =
      this.props.requiredStage === 'products' ? 'products' : 'default';
    return (
      <div className="mr-1 input-group">
        <input
          type="text"
          className="form-control"
          placeholder="search"
          value={this.state.value}
          onChange={({ currentTarget }: React.SyntheticEvent) => {
            const value = (currentTarget as HTMLInputElement).value;
            const visibleData = filter(
              value,
              this.state.searchByColumn,
              this.props.dataToFilter,
              this.props.requiredStage
            );

            this.setState({ value });

            this.props.update({
              visibleData,
              stage:
                this.props.requiredStage === 'products' ? 'products' : 'all',
              startDate: undefined,
              endDate: undefined,
            });
          }}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-success dropdown-toggle"
            id="columnSearch"
            data-toggle="dropdown"
          >
            {searchOptions[prop][this.state.searchByColumn]}
          </button>
          <div className="dropdown-menu">
            {Object.entries(searchOptions[prop]).map(([key, value]: any) => (
              <button
                key={key}
                className="dropdown-item"
                data-columnsearch={key}
                onClick={(e) => {
                  this.setState({
                    searchByColumn: e.currentTarget.dataset.columnsearch || '',
                    value: '',
                  });
                }}
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

export { ColumnFilter };
