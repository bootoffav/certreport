import { Tab } from 'tabler-react';
import { Standards } from './Standards/Standards';
import { PreTreatment1 } from '../PreTreatment1';

function renderStandards() {
  return (
    <Tab title="Standards">
      <Standards
        initStandards={this.state.standards.split(', ')}
        taskId={this.task_id || ''}
        setState={this.setState.bind(this)}
      />
      <PreTreatment1
        pretreatment1={this.state.pretreatment1}
        result={this.state.pretreatment1Result}
        handleChange={this.handleChange}
        resultChange={this.handlePreTreatment1Change}
      />
    </Tab>
  );
}

export { renderStandards };
