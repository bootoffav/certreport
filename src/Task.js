import React from 'react';
import B24 from './B24.js';
import { Link } from 'react-router-dom';
import Tooltip from 'rc-tooltip';
import 'rc-tooltip/assets/bootstrap.css';

export default class Task extends React.Component {
  constructor(props) {
      super(props);
      this.state = {};
  }
  componentDidMount() {
    B24.get_task(this.props.task.ID)
      .then(task => {
        if (task.state) {
          this.setState({ ...task.state });
        } else {
          this.setState({
            article: '-',
            standard: [],
            resultsReceived: '-',
            sentOn: '-',
            brand: []
          });
        }
      });
  }

  render() {
    return (
      <tr>
        <td>{this.props.position}</td>
        <td>
          <Tooltip placement="left" overlay={<span>B24 link</span>}>
            <a href={`https://xmtextiles.bitrix24.ru/company/personal/user/460/tasks/task/view/${this.props.task.ID}/`}
              target="_blank" rel="noopener noreferrer"
            >{this.state.serialNumber}</a>
          </Tooltip>
        </td>
        <td>
          {this.state.brand
          ? this.state.brand.map(el => el.label).join(', ')
          : <div className="loader"></div>}
        </td>
        <td width="30%">
          {this.state.sentOn
            ? <Link to={{
              pathname: `/edit/${this.props.task.ID}`,
              state: {
                ...this.state,
                finishedOn: this.state.finishedOn ? this.state.finishedOn.valueOf() : null,
                sentOn: this.state.sentOn ? this.state.sentOn.valueOf() : null,
                receivedOn: this.state.receivedOn ? this.state.receivedOn.valueOf() : null,
                resultsReceived: this.state.resultsReceived ? this.state.resultsReceived.valueOf() : null,
                startedOn: this.state.startedOn ? this.state.startedOn.valueOf() : null
              }
            }}
            >{this.props.task.TITLE}</Link>
            : <div className="loader"></div>}
        </td>
        <td>
            {this.state.sentOn
            ? (this.state.sentOn === '-') ? '-' : this.state.sentOn.format("DD MMM YYYY")
            : <div className="loader"></div>}
        </td>
        <td>{ this.state.resultsReceived
          ?  (this.state.resultsReceived === '-') ? '-' : this.state.resultsReceived.format("DD MMM YYYY")
          : <div className="loader"></div>}
        </td>
        <td />
        <td />
        <td>
          {this.state.article
            ? this.state.article
            : <div className="loader"></div>}
        </td>
        <td>
          {(this.state.standard)
           ? this.state.standard.map(el => el.value).join(', ')
           : <div className="loader"></div>}
        </td>
      </tr>
    );
  }
}