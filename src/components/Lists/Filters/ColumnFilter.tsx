import * as React from 'react';

interface IColumnFilterProps {
  dataToFilter: any; // tasks or products
  typeOfFilteringData: 'tasks' | 'products';
  update: any;
}

interface IColumnFilterState {
  searchByColumn: string;
  value: string;
}

const searchOptions: {
  [key: string]: any;
} = {
  tasks: {
    title: 'Task',
    testReport: 'Test report',
    certificate: 'Certificate',
    standards: 'Standards',
    article: 'Article',
  },
  products: {
    article: 'Article',
    standards: 'Standards',
    tasks: 'Certifications',
  },
};

function filter(
  value: string,
  searchByColumn: string,
  dataToFilter: any,
  typeOfFilteringData: string
) {
  const valueLowered = value.toLowerCase();

  const filterProducts = (product: any) => {
    switch (searchByColumn) {
      case 'article':
        return product.article.toLowerCase().includes(valueLowered);
      case 'standards':
        return product.standards
          .join(', ')
          .toLowerCase()
          .includes(valueLowered);
      case 'tasks':
        const titles = product.tasks.map((task: any) => task.title);
        return titles.join(', ').toLowerCase().includes(valueLowered);
    }
  };

  const filterTasks = (task: any) =>
    searchByColumn === 'title'
      ? task[searchByColumn].toLowerCase().includes(valueLowered)
      : task.state[searchByColumn].toLowerCase().includes(valueLowered);

  return typeOfFilteringData === 'products'
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
      props.typeOfFilteringData === 'products' ? 'article' : 'title';

    this.state = {
      searchByColumn,
      value: '',
    };
  }

  // componentDidUpdate(prevProps: IColumnFilterProps) {
  //   if (
  //     prevProps.requiredStage !== 'products' &&
  //     this.props.requiredStage === 'products'
  //   ) {
  //     this.setState({ searchByColumn: 'article' });
  //   }
  // }

  render = () => {
    const prop = this.props.typeOfFilteringData;
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
              this.props.typeOfFilteringData
            );

            this.setState({ value });

            this.props.update({
              visibleData,
              // startDate: undefined,
              // endDate: undefined,
            });
          }}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-success dropdown-toggle"
            data-toggle="dropdown"
          >
            {searchOptions[prop][this.state.searchByColumn]}
          </button>
          <div className="dropdown-menu">
            {Object.entries(searchOptions[prop]).map(([key, label]: any) => (
              <button
                key={key}
                className="dropdown-item"
                onClick={(e) => {
                  this.setState({
                    searchByColumn: key,
                    value: '',
                  });
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };
}

export { ColumnFilter };
