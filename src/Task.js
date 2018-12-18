import React from 'react';
import B24 from './B24.js';
import { parseSelectable, parseDates } from './Helpers.js';


export default class Task extends React.Component {
  constructor(props) {
      super(props);
      this.props = props;
      this.state = {};
  }
  componentDidMount() {
    B24.get_task(this.props.task.ID)
      .then(task => {
        if (task.state) {
          this.setState({
            ...task.state,
            ...parseDates(task.state),
            iso: parseSelectable('iso', task.state.iso)
          });
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

  render() {
    return (
      <tr>
        <td>{this.props.position}</td>
        <td>{this.state.serialNumber}</td>
        <td width="30%">
            <a href={`/edit/${this.props.task.ID}`}>{this.props.task.TITLE}</a><br />
            {/* <a href={`https://xmtextiles.bitrix24.ru/workgroups/group/21/tasks/task/view/${this.props.task.ID}/`}>bitrix link</a> */}
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
          {(this.state.iso)
           ? this.state.iso.map(el => el.value).join(', ')
           : <div className="loader"></div>}
        </td>
      </tr>
    );
  }
}