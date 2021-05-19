import { Dimmer, Tab } from 'tabler-react';
import { PickDate } from '../FormFields';
import { Status } from '../../Notification/Notification';

function renderDates() {
  return (
    <Tab title="Dates">
      <Dimmer active={this.state.requestStatus !== Status.FillingForm} loader>
        <div className="d-flex justify-content-center m-2">
          <PickDate
            date={this.state.pausedUntil}
            label="Paused until:"
            handleChange={(date: Date) =>
              this.handleDateChange(date, 'pausedUntil')
            }
          />
          <PickDate
            date={this.state.readyOn}
            label="Sample to be prepared:"
            handleChange={(date: Date) =>
              this.handleDateChange(date, 'readyOn')
            }
          />
          <PickDate
            date={this.state.sentOn}
            label="Sample has sent:"
            handleChange={(date: Date) => this.handleDateChange(date, 'sentOn')}
          />
        </div>
        <div className="d-flex justify-content-center">
          <PickDate
            date={this.state.receivedOn}
            label="Sample has received by lab:"
            handleChange={(date: Date) =>
              this.handleDateChange(date, 'receivedOn')
            }
          />
          <PickDate
            date={this.state.startedOn}
            label="Test is started:"
            handleChange={(date: Date) =>
              this.handleDateChange(date, 'startedOn')
            }
          />
          <PickDate
            date={this.state.testFinishedOnPlanDate}
            label="ETD (Test-report)"
            handleChange={(date: Date) =>
              this.handleDateChange(date, 'testFinishedOnPlanDate')
            }
          />
        </div>
        <div className="d-flex justify-content-center">
          <PickDate
            date={this.state.testFinishedOnRealDate}
            label="Test really finished on:"
            handleChange={(date: Date) =>
              this.handleDateChange(date, 'testFinishedOnRealDate')
            }
          />
          <PickDate
            date={this.state.certReceivedOnPlanDate}
            label="ETD (Certificate)"
            handleChange={(date: Date) =>
              this.handleDateChange(date, 'certReceivedOnPlanDate')
            }
          />
          <PickDate
            date={this.state.certReceivedOnRealDate}
            label="Certificate really received on:"
            handleChange={(date: Date) =>
              this.handleDateChange(date, 'certReceivedOnRealDate')
            }
          />
        </div>
        {[
          '10. Repeat Testing is started',
          '11. Repeat Test-report ready',
        ].includes(this.state.stage) && renderRepeatDates.call(this)}
      </Dimmer>
    </Tab>
  );
}

function renderRepeatDates() {
  return (
    <>
      <hr />
      <div className="d-flex justify-content-center">
        <h5>Repeat testing is started dates:</h5>
      </div>
      <div className="d-flex justify-content-center">
        <PickDate
          date={this.state.repeatReceivedOn}
          label="R* - Sample has received by lab:"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'repeatReceivedOn')
          }
        />
        <PickDate
          date={this.state.repeatStartedOn}
          label="R* - Test is started:"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'repeatStartedOn')
          }
        />
        <PickDate
          date={this.state.repeatTestFinishedOnPlanDate}
          label="R* - ETD (Test-report)"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'repeatTestFinishedOnPlanDate')
          }
        />
      </div>
      <div className="d-flex justify-content-center">
        <PickDate
          date={this.state.repeatTestFinishedOnRealDate}
          label="R* - Test really finished on:"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'repeatTestFinishedOnRealDate')
          }
        />
        <PickDate
          date={this.state.repeatCertReceivedOnPlanDate}
          label="R* - ETD (Certificate)"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'repeatCertReceivedOnPlanDate')
          }
        />
        <PickDate
          date={this.state.repeatCertReceivedOnRealDate}
          label="R* - Certificate really received on:"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'repeatCertReceivedOnRealDate')
          }
        />
      </div>
    </>
  );
}

export { renderDates };
