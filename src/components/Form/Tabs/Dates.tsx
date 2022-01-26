import { Dimmer } from 'tabler-react';
import dayjs from 'dayjs';
import { pickBy } from 'lodash';
import { PickDate } from '../FormFields';
import { Status } from 'components/Notification/Notification';
import { stages } from 'defaults';
import DB from 'backend/DBManager';
import type { Stage, TaskState } from 'Task/Task.interface';
import { useEffect, useState } from 'react';

type DatesProps = {
  requestStatus: Status;
  pausedUntil: TaskState['pausedUntil'];
  readyOn: TaskState['readyOn'];
  sentOn: TaskState['sentOn'];
  receivedOn: TaskState['receivedOn'];
  startedOn: TaskState['startedOn'];
  testFinishedOnPlanDate: TaskState['testFinishedOnPlanDate'];
  testFinishedOnRealDate: TaskState['testFinishedOnRealDate'];
  certReceivedOnPlanDate: TaskState['certReceivedOnPlanDate'];
  certReceivedOnRealDate: TaskState['certReceivedOnRealDate'];
  stage: Stage | string;
  taskId?: `${number}`;
  repeatReceivedOn: TaskState['repeatReceivedOn'];
  repeatStartedOn: TaskState['repeatStartedOn'];
  repeatTestFinishedOnPlanDate: TaskState['repeatTestFinishedOnPlanDate'];
  repeatTestFinishedOnRealDate: TaskState['repeatTestFinishedOnRealDate'];
  repeatCertReceivedOnPlanDate: TaskState['repeatCertReceivedOnPlanDate'];
  repeatCertReceivedOnRealDate: TaskState['repeatCertReceivedOnRealDate'];
  handleDateChange: any;
};

function RenderDates(props: DatesProps) {
  const [expirationDate, setExpirationDate] = useState('');
  useEffect(() => {
    (async () => {
      if (props.taskId) {
        await DB.get(props.taskId, 'expirationDate', 'certification')
          .then((expirationDate: TaskState['expirationDate']) => {
            setExpirationDate(expirationDate);
          })
          .catch((e) => console.log(e));
      }
    })();
  }, [props.taskId]);

  const repeatedStages = stages[1].options.map((stage: any) => stage.label);
  return (
    <Dimmer active={props.requestStatus !== Status.FillingForm} loader>
      <div className="d-flex justify-content-center m-2">
        <PickDate
          date={props.pausedUntil}
          label="Paused until:"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'pausedUntil')
          }
        />
        <PickDate
          date={props.readyOn}
          label="Sample to be prepared:"
          handleChange={(date: Date) => this.handleDateChange(date, 'readyOn')}
        />
        <PickDate
          date={props.sentOn}
          label="Sample has sent:"
          handleChange={(date: Date) => this.handleDateChange(date, 'sentOn')}
        />
      </div>
      <div className="d-flex justify-content-center">
        <PickDate
          date={props.receivedOn}
          label="Sample has received by lab:"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'receivedOn')
          }
        />
        <PickDate
          date={props.startedOn}
          label="Test is started:"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'startedOn')
          }
        />
        <PickDate
          date={props.testFinishedOnPlanDate}
          label="ETD (Test-report)"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'testFinishedOnPlanDate')
          }
        />
      </div>
      <div className="d-flex justify-content-center">
        <PickDate
          date={props.testFinishedOnRealDate}
          label="Test really finished on:"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'testFinishedOnRealDate')
          }
        />
        <PickDate
          date={props.certReceivedOnPlanDate}
          label="ETD (Certificate)"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'certReceivedOnPlanDate')
          }
        />
        <PickDate
          date={props.certReceivedOnRealDate}
          label="Certificate really received on:"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'certReceivedOnRealDate')
          }
        />
        <PickDate
          date={expirationDate}
          label="Expiration Date:"
          handleChange={(rawDate: Date) => {
            const newExpirationDate = dayjs(rawDate).format('DDMMMYYYY');
            setExpirationDate(newExpirationDate);
            DB.updateInstance(
              props.taskId as string,
              { expirationDate: newExpirationDate },
              'certification'
            );
          }}
        />
      </div>
      {repeatedStages.includes(props.stage) &&
        renderRepeatDates(pickBy(props, (_, k) => k.startsWith('repeat')))}
    </Dimmer>
  );
}

function renderRepeatDates(props: any) {
  return (
    <>
      <hr />
      <div className="d-flex justify-content-center">
        <h5>Repeat testing is started dates:</h5>
      </div>
      <div className="d-flex justify-content-center">
        <PickDate
          date={props.repeatReceivedOn}
          label="R* - Sample has received by lab:"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'repeatReceivedOn')
          }
        />
        <PickDate
          date={props.repeatStartedOn}
          label="R* - Test is started:"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'repeatStartedOn')
          }
        />
        <PickDate
          date={props.repeatTestFinishedOnPlanDate}
          label="R* - ETD (Test-report)"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'repeatTestFinishedOnPlanDate')
          }
        />
      </div>
      <div className="d-flex justify-content-center">
        <PickDate
          date={props.repeatTestFinishedOnRealDate}
          label="R* - Test really finished on:"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'repeatTestFinishedOnRealDate')
          }
        />
        <PickDate
          date={props.repeatCertReceivedOnPlanDate}
          label="R* - ETD (Certificate)"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'repeatCertReceivedOnPlanDate')
          }
        />
        <PickDate
          date={props.repeatCertReceivedOnRealDate}
          label="R* - Certificate really received on:"
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'repeatCertReceivedOnRealDate')
          }
        />
      </div>
    </>
  );
}

export { RenderDates };
