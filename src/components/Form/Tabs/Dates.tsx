import { Dimmer } from 'tabler-react';
import dayjs from 'dayjs';
import { PickDate } from '../FormFields';
import { Status } from 'components/Notification/Notification';
import { stages } from 'defaults';
import DB from 'backend/DBManager';
import type { Stage, TaskState } from 'Task/Task.interface';
import { useEffect, useState } from 'react';
import { addEvent, deleteEvent } from 'B24/CalendarMethods';

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
  taskId?: `${number}`;
  handleDateChange: any;
};

function Dates(props: DatesProps) {
  const [expirationDate, setExpirationDate] = useState('');
  // const [ETDCertificateEventId, setETDCertificateEventId] = useState<number>();
  const [calendarExpirationEventId, setCalendarExpirationEventId] =
    useState<number>();

  useEffect(() => {
    if (props.taskId) {
      DB.get(props.taskId, 'expirationDate', 'certification')
        .then((expirationDate: TaskState['expirationDate']) => {
          setExpirationDate(expirationDate);
        })
        .catch((e) => console.log(e));
      DB.get(props.taskId, 'calendarExpirationEventId', 'certification')
        .then((ExpirationEventId: number) =>
          setCalendarExpirationEventId(ExpirationEventId)
        )
        .catch((e) => console.log(e));
      // DB.get(
      //   props.taskId,
      //   'calendarETDCertificateEventId',
      //   'certification'
      // ).then((ETDCertificateEventId: number) =>
      //   setETDCertificateEventId(ETDCertificateEventId)
      // );
    }
  }, [props.taskId]);

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
            // console.log(ETDCertificateEventId);
            props.handleDateChange(date, 'certReceivedOnPlanDate');
            // ETDCertificateEventId && deleteEvent(ETDCertificateEventId);
            // clear
            // if (date === null) {
            //   DB.updateInstance(
            //     props.taskId as string,
            //     {
            //       calendarETDCertificateEventId: null,
            //     },
            //     'certification'
            //   );
            //   return;
            // }

            // const newETDCertificateEventId = await addEvent({
            //   date,
            //   description: 'test',
            //   name: `ETD (Certificate) ${props.calendarEventName}`,
            //   section: 682,
            // })
            //   .then((res) => res.json())
            //   .then(({ result }) => result);
            // setETDCertificateEventId(newETDCertificateEventId);
            // DB.updateInstance(
            //   props.taskId as string,
            //   {
            //     calendarETDCertificateEventId: newETDCertificateEventId,
            //   },
            //   'certification'
            // );
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
              return DB.updateInstance(
                props.taskId as string,
                {
                  expirationDate: null,
                  calendarExpirationEventId: null,
                },
                'certification'
              );
            }

            // send expiration date to bitrix calendar
            const newCalendarExpirationEventId = await addEvent({
              section: 680,
              date: expirationDate,
              description: `${process.env.REACT_APP_B24_HOST}/company/personal/user/${process.env.REACT_APP_B24_USER_ID}/tasks/task/view/${props.taskId}/`,
              name: `Expiration of ${props.calendarEventName}`,
            })
              .then((res) => res.json())
              .then(({ result }) => result);
            setCalendarExpirationEventId(newCalendarExpirationEventId);
            // update fauna instance, add new Event Id
            DB.updateInstance(
              props.taskId as string,
              {
                expirationDate,
                calendarExpirationEventId: newCalendarExpirationEventId,
              },
              'certification'
            );
          }}
        />
      </div>
      {repeatedStages.includes(props.stage) &&
        RepeatDates({
          taskId: props.taskId,
        })}
    </Dimmer>
  );
}

type ISODate = `${number}-${number}-${number}`;

interface IRepeatDates {
  repeatReceivedOn?: ISODate;
  repeatStartedOn?: ISODate;
  repeatTestFinishedOnPlanDate?: ISODate;
  repeatTestFinishedOnRealDate?: ISODate;
  repeatCertReceivedOnPlanDate?: ISODate;
  repeatCertReceivedOnRealDate?: ISODate;
}

function RepeatDates({ taskId }: { taskId?: string }) {
  const [repeatDates, setRepeatDates] = useState<IRepeatDates>();

  useEffect(() => {
    taskId &&
      DB.get(taskId, 'repeatDates', 'certification').then((response) => {
        setRepeatDates(response);
      });
  }, [taskId]);

  const dateChanger = (field: keyof IRepeatDates & string, date: Date) => {
    const newDate = date ? (dayjs(date).format('YYYY-MM-DD') as ISODate) : null;
    // 1. change UI state
    setRepeatDates((state) => ({
      ...state,
      [field]: newDate,
    }));

    // 2. change value in DB
    DB.updateInstance(
      taskId as string,
      {
        repeatDates: {
          [field]: newDate,
        },
      },
      'certification'
    );
  };

  return (
    <>
      <hr />
      <div className="d-flex justify-content-center">
        <h5>Repeat testing is started dates:</h5>
      </div>
      <div className="d-flex justify-content-center">
        <PickDate
          date={repeatDates?.repeatReceivedOn || ''}
          label="R* - Sample has received by lab:"
          handleChange={(date: Date) => dateChanger('repeatReceivedOn', date)}
        />
        <PickDate
          date={repeatDates?.repeatStartedOn || ''}
          label="R* - Test is started:"
          handleChange={(date: Date) => dateChanger('repeatStartedOn', date)}
        />
        <PickDate
          date={repeatDates?.repeatTestFinishedOnPlanDate || ''}
          label="R* - ETD (Test-report)"
          handleChange={(date: Date) =>
            dateChanger('repeatTestFinishedOnPlanDate', date)
          }
        />
      </div>
      <div className="d-flex justify-content-center">
        <PickDate
          date={repeatDates?.repeatTestFinishedOnRealDate || ''}
          label="R* - Test really finished on:"
          handleChange={(date: Date) =>
            dateChanger('repeatTestFinishedOnRealDate', date)
          }
        />
        <PickDate
          date={repeatDates?.repeatCertReceivedOnPlanDate || ''}
          label="R* - ETD (Certificate)"
          handleChange={(date: Date) =>
            dateChanger('repeatCertReceivedOnPlanDate', date)
          }
        />
        <PickDate
          date={repeatDates?.repeatCertReceivedOnRealDate || ''}
          label="R* - Certificate really received on:"
          handleChange={(date: Date) =>
            dateChanger('repeatCertReceivedOnRealDate', date)
          }
        />
      </div>
    </>
  );
}

export default Dates;
