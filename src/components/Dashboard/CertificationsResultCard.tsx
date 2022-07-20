import { StatsCard, Card } from 'tabler-react';
import { tasksInRange } from './Dashboard';
import { useAppSelector } from 'store/hooks';
import { TaskState, Payment } from 'Task/Task.interface';
import './CertificationsResultCard.css';
import { renderTableOfDiagramSegment } from './utils';

type CertificationsResultCardProps = {
  resume: TaskState['resume'] | '';
  label: 'PASS' | 'PASS (Partly)' | 'FAIL' | 'All';
};
const CertificationsResultCard = ({
  resume,
  label,
}: CertificationsResultCardProps) => {
  let { tasks: allTasks, payments } = useAppSelector(({ main, dashboard }) => ({
    tasks: dashboard.tasksOfActiveSpendingBlocks,
    payments: main.payments,
  }));
  const tasks = allTasks.filter(
    ({ state }) => resume === '' || state.resume === resume
  );
  const sum = Math.round(
    tasks.reduce((sum, { id }) => {
      payments[id]?.map(({ price }: Payment) => (sum += +price));
      return sum;
    }, 0)
  );

  return (
    <Card>
      <Card.Body>
        {resume !== '' && (
          <div className={`percentColor${resume} text-right`}>
            {((tasks.length / allTasks.length) * 100).toFixed(1) || '0'}%
          </div>
        )}
        <div className="h1 m-0 text-center">
          <div
            className={`display-5 certificationsResultCard`}
            onClick={() =>
              renderTableOfDiagramSegment('', '', payments, tasks, true)
            }
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