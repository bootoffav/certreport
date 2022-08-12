import { Dimmer } from 'tabler-react';
import dayjs from 'dayjs';
import { PickDate } from '../FormFields';
import { Status } from 'components/Notification/Notification';
import { stages } from 'defaults';
import DB from 'backend/DBManager';
import type { Stage, TaskState } from 'Task/Task.interface';
import { useEffect, useState } from 'react';
import { addEvent, deleteEvent } from 'B24/CalendarMethods';
import { useParams } from 'react-router-dom';
import RepeatDates from './RepeatDates';

type DatesProps = {
  calendarEventName: string;
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
  handleDateChange: any;
};

function Dates(props: DatesProps) {
  const { taskId } = useParams<{ taskId?: string }>();
  const [expirationDate, setExpirationDate] = useState('');
  const [calendarExpirationEventId, setCalendarExpirationEventId] =
    useState<number>();

  useEffect(() => {
    taskId &&
      DB.get(taskId, ['data'], 'certification').then(
        ({ expirationDate, calendarExpirationEventId }) => {
          setExpirationDate(expirationDate);
          setCalendarExpirationEventId(calendarExpirationEventId);
        }
      );
  }, [taskId]);

  const repeatedStages = stages[1].options.map((stage: any) => stage.label);
  return (
    <Dimmer active={props.requestStatus !== Status.FillingForm} loader>
      <div className="d-flex justify-content-center m-2">
        <PickDate
          date={props.pausedUntil}
          label="Paused until:"
          handleChange={(date: Date) => {
            props.handleDateChange(date, 'pausedUntil');
          }}
        />
        <PickDate
          date={props.readyOn}
          label="Sample to be prepared:"
          handleChange={(date: Date) => props.handleDateChange(date, 'readyOn')}
        />
        <PickDate
          date={props.sentOn}
          label="Sample has sent:"
          handleChange={(date: Date) => props.handleDateChange(date, 'sentOn')}
        />
      </div>
      <div className="d-flex justify-content-center">
        <PickDate
          date={props.receivedOn}
          label="Sample has received by lab:"
          handleChange={(date: Date) =>
            props.handleDateChange(date, 'receivedOn')
          }
        />
        <PickDate
          date={props.startedOn}
          label="Test is started:"
          handleChange={(date: Date) =>
            props.handleDateChange(date, 'startedOn')
          }
        />
        <PickDate
          date={props.testFinishedOnPlanDate}
          label="ETD (Test-report)"
          handleChange={(date: Date) =>
            props.handleDateChange(date, 'testFinishedOnPlanDate')
          }
        />
      </div>
      <div className="d-flex justify-content-center">
        <PickDate
          date={props.testFinishedOnRealDate}
          label="Test really finished on:"
          handleChange={(date: Date) =>
            props.handleDateChange(date, 'testFinishedOnRealDate')
          }
        />
        <PickDate
          date={props.certReceivedOnPlanDate}
          label="ETD (Certificate)"
          handleChange={async (date: Date) => {
            props.handleDateChange(date, 'certReceivedOnPlanDate');
          }}
        />
        <PickDate
          date={props.certReceivedOnRealDate}
          label="Certificate really received on:"
          handleChange={(date: Date) =>
            props.handleDateChange(date, 'certReceivedOnRealDate')
          }
        />
        <PickDate
          date={expirationDate}
          label="Expiration Date:"
          disabled={!taskId}
          handleChange={async (rawDate: Date) => {
            const newExpirationDate =
              rawDate === null ? '' : dayjs(rawDate).format('YYYY-MM-DD');
            setExpirationDate(newExpirationDate);
          }}
          onClose={async () => {
            // delete previous calendar event Id
            if (calendarExpirationEventId) {
              deleteEvent(calendarExpirationEventId);
            }

            if (expirationDate === '') {
              return (
                taskId &&
                DB.updateInstance(
                  taskId,
                  {
                    expirationDate: null,
                    calendarExpirationEventId: null,
                  },
                  'certification'
                )
              );
            }

            // send expiration date to bitrix calendar
            const newCalendarExpirationEventId = await addEvent({
              section: 680,
              date: expirationDate,
              description: `${process.env.REACT_APP_B24_HOST}/company/personal/user/${process.env.REACT_APP_B24_USER_ID}/tasks/task/view/${taskId}/`,
              name: `Expiration of ${props.calendarEventName}`,
            })
              .then((res) => res.json())
              .then(({ result }) => result);
            setCalendarExpirationEventId(newCalendarExpirationEventId);
            // update fauna instance, add new Event Id
            taskId &&
              DB.updateInstance(
                taskId,
                {
                  expirationDate,
                  calendarExpirationEventId: newCalendarExpirationEventId,
                },
                'certification'
              );
          }}
        />
      </div>
      {repeatedStages.includes(props.stage) && <RepeatDates />}
    </Dimmer>
  );
}

export default Dates;
