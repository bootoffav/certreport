import React from 'react';
import Loader from 'react-loader-spinner';
import B24 from './B24.js';
import './css/style.css';

const Task = (props) =>
    <tr>
        <td>{props.position}</td>
        <td>{props.data.RESPONSIBLE_NAME}</td>
        <td>
            <a href={`/edit/${props.data.ID}`}>{props.data.TITLE}</a>
        </td>
        <td>
            <a target="_blank" rel="noopener noreferrer"
            href={`https://xmtextiles.bitrix24.ru/workgroups/group/21/tasks/task/view/${props.data.ID}/`}>
            B24 link</a>
        </td>
    </tr>;

const ListHeader = () => 
    <thead>
        <tr>
            <th scope="col">#</th>
            <th scope="col">Responsible Employee</th>
            <th scope="col">Task name</th>
            <th scope="col">B24 Link</th>
        </tr>
    </thead>

export default class List extends React.Component {
    state = {};
    tasks = (() => new B24().get_tasks()
      .then(res => this.setState({ tasks: res.data.result }))
    )();
    render (){
        let position = 1;
        return (this.state.tasks)
        ? <table className="table">
            <ListHeader />
            <tbody>
            {this.state.tasks.map(task => {
                return <Task key={task.ID} data={task} position={position++}/>;
            })}
            </tbody>
          </table>
        : <div style={{marginTop: '10em'}}>
            <Loader className="spiner spiner-place" type="ThreeDots" height="80" width="500"/>
          </div>;
    }
}