import { Dimmer, Tab } from 'tabler-react';
import { Status } from 'components/Notification/Notification';
import { FileManagement } from 'components/FileManagement/FileManagement';

function renderFiles() {
  return (
    <Tab title="Files">
      <Dimmer active={this.state.requestStatus !== Status.FillingForm} loader>
        <FileManagement
          taskId={this.task_id}
          attachedFiles={this.state.attachedFiles}
          updateAttachedFiles={() => this.updateAttachedFiles()}
        />
      </Dimmer>
    </Tab>
  );
}

export { renderFiles };
