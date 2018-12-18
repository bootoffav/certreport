import React from 'react';
import Loader from 'react-loader-spinner';
import Task from './Task.js';
import B24 from './B24.js';
import './css/style.css';

export default class List extends React.Component {
    constructor (props) {
      super(props);
      this.state = {};
    }
    componentDidMount() {
      new B24().get_tasks().then(res => this.setState({
          tasks: res.data.result
        })
      );
    }
    render (){
        let position = 1;
        return (this.state.tasks)
        ? <table className="table table-bordered">
            <thead className="thead-light">
              <tr>
                  <th scope="col">#</th>
                  <th scope="col">##</th>
                  <th scope="col">Task name</th>
                  <th scope="col">Created On</th>
                  <th scope="col">Готовность</th>
                  <th scope="col">Test-report</th>
                  <th scope="col">Cert</th>
                  <th scope="col">Ткань</th>
                  <th scope="col">Стандарт</th>
              </tr>
            </thead>
            <tbody>
              {this.state.tasks.map(task => <Task key={task.ID} task={task} position={position++}/>)}
            </tbody>
          </table>
        : <div className="loader-place row align-items-center">
                <div className="col row justify-content-center">
                    <Loader type="ThreeDots" height="80" width="200"/>
                </div>
          </div>
    }
}