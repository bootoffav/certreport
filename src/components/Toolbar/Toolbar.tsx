import React from 'react';
import Task, { Stage } from '../../Task/Task';
import { defaultProps } from 'react-select/lib/Creatable';

const Toolbar: React.FunctionComponent<{
  onClick: (toolBarProp: Stage | undefined | string) => void;
}> = (props) => {

  const stages = [
    '00. Paused',
    '0. Sample to be prepared',
    '1. Sample Sent',
    '2. Sample Arrived',
    '3. PI Issued',
    '4. Payment Done',
    '5. Testing is started',
    '6. Pre-treatment done',
    '7. Test-report ready',
    '8. Certificate ready',
    '9. Ended'
  ];

  const ToolbarStageButton = (stage: string) => <button
    key={stage}
    className="btn btn-block btn-indigo"
    // @ts-ignore
      onClick={() => props.onClick(Stage[stage])}
    >{stage}</button>

  return (
    <div id="toolbar" style={{ width: 'inherit' }} className="btn-group" role="group" >
      <button className="btn btn-block btn-cyan" style={{ marginTop: 8 }}
        onClick={() => props.onClick(undefined)}
      >All</button>
      {stages.map(ToolbarStageButton)}
      <button
        className="btn btn-block btn-cyan"
        onClick={() => props.onClick('results')}
      >Results</button>
      <button
        className="btn btn-block btn-cyan"
        onClick={() => props.onClick('overdue')}
      >Overdue</button>
    </div>);

}

const filter = (
  tasks: Task[],
  requiredStage: Stage | undefined | string = undefined,
): Task[] => {
  switch (requiredStage) {
    case undefined:
    case 'results':
      return tasks;
    case 'overdue':
      return tasks.filter(t => t.overdue);
    default:
      // @ts-ignore
      return tasks.filter(t => Stage[t.state.stage] === requiredStage);
  }
}

export { Toolbar, filter };
