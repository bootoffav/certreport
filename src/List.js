import React from 'react';
import Loader from 'react-loader-spinner';
import B24 from './B24.js';
import './css/style.css';

function Task(props) {
    return (
        <tr>
            <td>
                <div>
                    {props.position}
                </div>
            </td>
            <td>
                <div>
                    {props.data.RESPONSIBLE_NAME}
                </div>
            </td>
            <td>
                <div>
                    {/* <a target="_blank" rel="noopener noreferrer"
                    href={`https://xmtextiles.bitrix24.ru/workgroups/group/21/tasks/task/view/${props.data.ID}/`}>
                    {props.data.TITLE}
                    </a> */}
                    <a href={`/edit/${props.data.ID}`}>{props.data.TITLE}</a>
                </div>
            </td>
            <td>
                <div>
                    'soon'
                </div>
            </td>
        </tr>
    );
}

const ListHeader = (props) => {
    return (
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Responsible Employee</th>
                <th scope="col">Task name</th>
                <th scope="col">Finish date</th>
            </tr>
      </thead>
    )
}

class List extends React.Component {
    constructor (props){
        super(props);
        this.state = {
            tasks: null,
            // tasks: [{
            //     ID: 45501,
            //     RESPONSIBLE_NAME: "Valya",
            //     TITLE: '165_AITEX - Contrast Color EN 20471 - Colombo-350 RED (MO & CO UK LTD, UK) - (sent 21NOV2018 - plan 20DEC2018) - 449.79 € (?)'
            // },
            // {
            //     ID: 45502,
            //     RESPONSIBLE_NAME: "Valya",
            //     TITLE: '165_AITEX - Contrast Color EN 20471 - Colombo-350 RED (MO & CO UK LTD, UK) - (sent 21NOV2018 - plan 20DEC2018) - 449.79 € (?)'
            // }],
            position: 1
        };
        this.update = this.update.bind(this);
        this.tasks = new B24().get_tasks().then(this.update);
    }
    update (response){
        this.setState({
            tasks: response.data.result,
        });
    }
    render (res){
        if (this.state.tasks === null) {
            return <div style={{marginTop: '10em'}}>
                    <Loader className="spiner spiner-place" type="ThreeDots" height="80" width="max-width"/>
                </div>
        }
        return (
            <table className="table">
              <ListHeader />
              <tbody>
                {this.state.tasks.map(task => {
                    return <Task key={task.ID} data={task} position={this.state.position++}/>

                })}
              </tbody>
            </table>
        );
    }
}


export default List;