import React from 'react';
import Task, { Stage } from '../../Task/Task';

const Toolbar: React.FunctionComponent<{
  onClick: (toolBarProp: Stage | undefined | string) => void;
}> = (props) =>
  <div className="row">
    <div id="toolbar" className="col btn-group btn-group-toggle" data-toggle="buttons">
      <label
        className="btn btn-light btn-sm active"
        onClick={() => props.onClick(undefined)}
      ><input type="radio" />All</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick(Stage['0. Sample to be prepared'])}
      ><input type="radio" />0. Sample to be prepared</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick(Stage['1. Sample Sent'])}
      ><input type="radio" />1. Sample sent</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick(Stage['2. Sample Arrived'])}
      ><input type="radio" />2. Sample arrived</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick(Stage['3. PI Issued'])}
      ><input type="radio" />3. PI Issued</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick(Stage['4. Payment Done'])}
      ><input type="radio" />4. Payment Done</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick(Stage['5. Testing is started'])}
      ><input type="radio" />5. Testing is started</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick(Stage['6. Pre-treatment done'])}
      ><input type="radio" />6. Pre-treatment done</label>
      <label
        className="btn btn-warning btn-sm"
        onClick={() => props.onClick(Stage['7. Test-report ready'])}
      ><input type="radio" />7. Test-report ready</label>
      {Number(localStorage.getItem('includeCompletedTasks'))
        ?
        <label
          className="btn btn-warning btn-sm"
          onClick={() => props.onClick(Stage['8. Certificate ready'])}
        ><input type="radio" />8. Certificate ready</label>
        :
        ''
      }
      {Number(localStorage.getItem('includeEndedTasks'))
        ?
        <label
          className="btn btn-warning btn-sm"
          onClick={() => props.onClick(Stage['9. Ended'])}
        ><input type="radio" />9. Ended</label>
        :
        ''
      }
      <label
        className="btn btn-light btn-sm"
        onClick={() => props.onClick('results')}
      ><input type="radio" />Results</label>
      <label
        className="btn btn-light btn-sm"
        onClick={() => props.onClick('overdue')}
      ><input type="radio" />Overdue</label>
    </div>
  </div>

const filter = (
  tasks: Task[],
  requiredStage: Stage | undefined | string = undefined,
  i = 1
): Task[] => {
  switch (requiredStage) {
    case undefined:
      case 'results':
        return tasks.map(t => {
        t.position = i++;
        return t;
      });
    case 'overdue':
      return tasks.filter(t => t.overdue)
        .map(t => {
          t.position = i++;
          return t;
        });
    default:
      // @ts-ignore
      return tasks.filter(t => Stage[t.state.stage] === requiredStage)
        .map(t => {
          t.position = i++;
          return t;
        });
  }
}


export { Toolbar, filter };