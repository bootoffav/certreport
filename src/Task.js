import React from 'react';
import moment from 'moment';
import Loader from 'react-loader-spinner';
import B24 from './B24.js';

export default class Task extends React.Component {
  constructor(props) {
      super(props);
      this.props = props;
      this.state = {};
  }
  componentDidMount() {
    const b24 = new B24();
    const response = (async () => await b24.get_task(this.props.task.ID))();
    response.then(task => {
      if (task.state) {
        this.setState({...task.state});
      } else {
        this.setState({
          article: '-',
          iso: [],
          resultsReceived: '-',
          sentOn: '-'
        });
      }
    });
  }
  waiter = () => <Loader type="Circles" color="#996C96" height="30" width="30"/>;

  render() {
    return (
      <tr>
        <td>{this.props.position}</td>
        <td>{this.state.serialNumber}</td>
        <td>
            <a href={`/edit/${this.props.task.ID}`}>{this.props.task.TITLE}</a>
        </td>
        <td>
            <a target="_blank" rel="noopener noreferrer"
            href={`https://xmtextiles.bitrix24.ru/workgroups/group/21/tasks/task/view/${this.props.task.ID}/`}>link</a>
        </td>
        <td>
            {this.state.sentOn
            ? (this.state.sentOn === '-') ? '-' : moment(this.state.sentOn).format("DD MMM YYYY")
            : this.waiter()}
        </td>
        <td>{ this.state.resultsReceived
          ?  (this.state.resultsReceived === '-') ? '-' : moment(this.state.resultsReceived).format("DD MMM YYYY")
          : this.waiter() }
        </td>
        <td />
        <td />
        <td>
          {this.state.article
            ? this.state.article
            : this.waiter()}
        </td>
        <td>
          {(this.state.iso)
           ? this.state.iso.map(el => el.value).join(', ')
           : this.waiter()
          }
        </td>
      </tr>
    );
  }
}