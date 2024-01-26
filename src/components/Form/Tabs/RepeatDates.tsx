import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import DB from '../../../backend/DBManager';
import { PickDate } from '../FormFields';
import { useParams } from 'react-router-dom';

type ISODate = `${number}-${number}-${number}`;

interface IRepeatDates {
  repeatReceivedOn?: ISODate;
  repeatStartedOn?: ISODate;
  repeatTestFinishedOnPlanDate?: ISODate;
  repeatTestFinishedOnRealDate?: ISODate;
  repeatCertReceivedOnPlanDate?: ISODate;
  repeatCertReceivedOnRealDate?: ISODate;
}

function RepeatDates() {
  const { taskId } = useParams<{ taskId: string }>();
  const [repeatDates, setRepeatDates] = useState<IRepeatDates>();

  useEffect(() => {
    taskId &&
      DB.get(taskId, ['data', 'repeatDates'], 'certification').then(
        setRepeatDates
      );
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

export default RepeatDates;
