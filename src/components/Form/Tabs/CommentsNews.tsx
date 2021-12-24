import { Dimmer, Tab } from 'tabler-react';
import { Status } from 'components/Notification/Notification';
import { BaseInput } from '../FormFields';

function renderCommentsNews() {
  return (
    <Tab title="Comments & News">
      <Dimmer active={this.state.requestStatus !== Status.FillingForm} loader>
        <div className="form-row">
          <BaseInput
            required={false}
            value={this.state.news}
            className="w-100"
            id="news"
            label="News:"
            handleChange={this.handleChange}
          />
        </div>
        <div className="form-row">
          <label htmlFor="comments">Comments:</label>
          <textarea
            className="form-control"
            value={this.state.comments}
            id="comments"
            rows={15}
            onChange={this.handleChange}
          />
        </div>
      </Dimmer>
    </Tab>
  );
}

export { renderCommentsNews };
