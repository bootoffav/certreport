import { StatsCard, Card } from 'tabler-react';
import { tasksInRange } from './Dashboard';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { TaskState, Payment } from 'Task/Task.interface';
import './CertificationsResultCard.css';
import { renderTableOfDiagramSegment } from './utils';
import { changeResume } from 'store/slices/dashboardSlice';

type CertificationsResultCardProps = {
  resume: TaskState['resume'] | '' | 'allWithResults';
  label:
    | 'PASS'
    | 'PASS (Partly)'
    | 'FAIL'
    | 'All with results'
    | 'All'
    | 'No Sample';
};
const CertificationsResultCard = ({
  resume,
  label,
}: CertificationsResultCardProps) => {
  const dispatch = useAppDispatch();
  const { tasks: allTasks } = useAppSelector(({ dashboard }) => ({
    tasks: dashboard.tasksOfActiveSpendingBlocks,
  }));
  const tasksWithResume = allTasks.filter(({ state }) =>
    ['fail', 'pass', 'partly'].includes(state.resume)
  );

  const tasks = allTasks.filter(({ state }) =>
    resume === 'allWithResults'
      ? ['fail', 'pass', 'partly'].includes(state.resume)
      : state.resume === resume
  );

  const sum = Math.round(
    tasks.reduce((sum, { state }) => {
      state.payments?.map(({ price }: Payment) => (sum += +price));
      return sum;
    }, 0)
  );

  return (
    <Card>
      <Card.Body>
        {resume !== 'allWithResults' && (
          <div className={`percentColor${resume} text-right`}>
            {((tasks.length / tasksWithResume.length) * 100 || 0).toFixed(1)}%
          </div>
        )}
        <div className="h1 m-0 text-center">
          <div
            className={`display-5 certificationsResultCard`}
            onClick={() => {
              dispatch(changeResume(resume));
              renderTableOfDiagramSegment('', '', tasks, true);
            }}
          >
            {tasks.length}
          </div>
        </div>
        <div className="text-center">{`${label} certifications: €${sum.toLocaleString()}`}</div>
      </Card.Body>
    </Card>
  );
};

const Products = () => {
  let { tasks, startDate, endDate } = useAppSelector(({ main }) => ({
    tasks: main.filteredTasks,
    startDate: main.startDate,
    endDate: main.endDate,
  }));

  const amountOfUniqueProducts = () => {
    (tasks as any) =
      startDate || endDate ? tasksInRange(tasks, 'CREATED_DATE') : tasks;

    return new Set(tasks.map(({ state: { article } }: any) => article)).size;
  };

  const movement = () => {
    const tasksBeforePeriod = tasksInRange(
      tasks,
      'CREATED_DATE',
      new Date('December 17, 2010 03:24:00')
    ).length;

    return Math.round((amountOfUniqueProducts() * 100) / tasksBeforePeriod);
  };

  return (
    <StatsCard
      layout={1}
      movement={movement()}
      total={<div className="display-5">{amountOfUniqueProducts()}</div>}
      label="Products"
    />
  );
};

export { CertificationsResultCard, Products };
