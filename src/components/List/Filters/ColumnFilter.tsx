import * as React from 'react';

interface IColumnFilterProps {
  tasks: any;
  requiredStage?: string;
  update: any;
  allProducts: any;
  value: string;
}

class ColumnFilter extends React.Component<IColumnFilterProps> {
  static getDerivedStateFromProps(props: IColumnFilterProps) {
    return props.requiredStage === 'products'
      ? {
          searchingColumn: 'article',
        }
      : null;
  }

  state = {
    searchingColumn: 'title',
  };

  filter({ currentTarget }: React.SyntheticEvent) {
    let visibleData;
    const { value } = currentTarget as HTMLInputElement;
    const { searchingColumn } = this.state;
    const valueLowered = value.toLowerCase();

    if (this.props.requiredStage === 'products') {
      visibleData = this.props.allProducts.filter((product: any) =>
        searchingColumn === 'article'
          ? product.article.toLowerCase().includes(valueLowered)
          : product[searchingColumn]
              .join(', ')
              .toLowerCase()
              .includes(valueLowered)
      );
    } else {
      visibleData = this.props.tasks.filter((task: any) =>
        searchingColumn === 'title'
          ? task[searchingColumn].toLowerCase().includes(valueLowered)
          : task.state[searchingColumn].toLowerCase().includes(valueLowered)
      );
    }

    this.props.update({
      visibleData,
      columnFilterValue: value,
      stage: this.props.requiredStage === 'products' ? 'products' : 'all',
      startDate: undefined,
      endDate: undefined,
    });
  }

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
        article: 'Article',
        // standards: 'Standards',
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
          onChange={this.filter.bind(this)}
          value={this.props.value}
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-success dropdown-toggle"
            id="columnSearch"
            data-toggle="dropdown"
            /* TODO: change this weird ?? ASAP */
          >
            {searchOptions[prop][this.state.searchingColumn] ?? 'Article'}
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

export { ColumnFilter };
