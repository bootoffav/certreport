import { Tab, Dimmer } from 'tabler-react';
import { Status } from 'components/Notification/Notification';
import { FabricApplicationForm } from '../FabricApplicationForm';

function renderFabricApplicationForm() {
  return (
    <Tab title="Fabric Application Form">
      <Dimmer active={this.state.requestStatus !== Status.FillingForm} loader>
        <FabricApplicationForm
          state={this.state.DBState}
          appForm={this.state}
          updateParent={(DBState: any) => this.setState({ DBState })}
        />
      </Dimmer>
    </Tab>
  );
}

export { renderFabricApplicationForm };
