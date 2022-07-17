import { StatsCard } from 'tabler-react';
import { tasksInRange } from './Dashboard';
import { useAppSelector } from 'store/hooks';
import { TaskState } from 'Task/Task.interface';
import styles from './StatCards.module.css';
import { renderTableOfDiagramSegment } from './utils';

type CertificationsResultCardProps = {
  resume: TaskState['resume'] | '';
  label: 'PASS' | 'PASS (Partly)' | 'FAIL' | 'All';
};
const CertificationsResultCard = ({
  resume,
  label,
}: CertificationsResultCardProps) => {
  let { tasks, payments } = useAppSelector(({ main, dashboard }) => ({
    tasks: dashboard.tasksOfActiveSpendingBlocks,
    payments: main.payments,
  }));
  tasks = tasks.filter(({ state }) => resume === '' || state.resume === resume);

  return (
    <StatsCard
      layout={1}
      movement={''}
      total={
        <div
          className={`display-5 ${styles.statCard}`}
          onClick={() =>
            renderTableOfDiagramSegment('', '', payments, tasks, true)
          }
        >
          {tasks.length}
        </div>
      }
      label={`${label} certifications`}
    />
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
