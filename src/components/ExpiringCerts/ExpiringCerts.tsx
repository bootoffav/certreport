import { Link } from 'react-router-dom';
import { Dimmer } from 'tabler-react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import type { TaskState } from 'Task/Task.interface';
import './ExpiringCertsTab.css';
import DB from 'backend/DBManager';

type ExpiringCertsProps = {
  tasks: TaskState[];
};

export type TabProps = {
  tasks?: TaskState[];
  months: 0 | 1 | 3 | 6 | 12;
};

const Tab = ({ months }: TabProps) => {
  const getTabTitle = () => {
    return months ? (
      months + ` month${months !== 1 ? 's' : ''}`
    ) : (
      <span style={{ color: 'red' }}>Expired certs</span>
    );
  };

  return (
    <li className="nav-item" role="presentation" key={months}>
      <button
        className={`nav-link ${
          months === 12 ? 'active' : ''
        } mx-auto expiringCertsTab`}
        id={`months${months}-tab`}
        data-bs-toggle="tab"
        data-bs-target={`#months${months}`}
        type="button"
        role="tab"
        aria-controls={`months${months}`}
        aria-selected="true"
      >
        {getTabTitle()}
      </button>
    </li>
  );
};

const TabContent = ({ months, tasks }: TabProps) => {
  const [expiringCerts, setExpiringCerts] = useState<any[]>();
  const [filteredCerts, setFilteredCerts] = useState<any[]>();

  useEffect(() => {
    (async () => {
      // filter certs by comparing existing task pool with expiring tasks
      const certs = await getExpiringCertsTasks(months); //.then((certs) =>
      setExpiringCerts(certs);
    })();
  }, [months]);

  useEffect(() => {
    const certs = expiringCerts?.filter(([certTaskId, _]) => {
      return Boolean(tasks?.find(({ id }) => id === certTaskId));
    });
    setFilteredCerts(certs);
  }, [expiringCerts, tasks]);

  const outputTasks = () => (
    <table className="mt-2 table">
      <thead>
        <tr>
          <th scope="col" style={{ width: '5%' }}>
            #
          </th>
          <th scope="col" style={{ width: '15%' }}>
            Expiration Date
          </th>
          <th scope="col" style={{ width: '15%' }}>
            Item
          </th>
          <th scope="col">Task in B24</th>
          <th scope="col">Edit task</th>
        </tr>
      </thead>
      <tbody>
        {filteredCerts?.map((task: any, index) => {
          const linkedTask = tasks?.find(({ id }) => id === task[0]);
          return (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{dayjs(task[1]).format('DDMMMYYYY')}</td>
              <td>
                <a href={'item/' + linkedTask?.state.article}>
                  {tasks?.find(({ id }) => id === task[0])?.state.article}
                </a>
              </td>
              <td>
                <a
                  href={`${process.env.REACT_APP_B24_HOST}/company/personal/user/460/tasks/task/view/${task[0]}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {linkedTask?.title}
                </a>
              </td>
              <td>
                <Link
                  to={`/edit/${task[0]}`}
                  style={{ textDecoration: 'none' }}
                >
                  {linkedTask?.title}
                </Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div
      className={`tab-pane fade show ${months === 12 ? 'active' : ''}`}
      id={`months${months}`}
      role="tabpanel"
      aria-labelledby={`months${months}-tab`}
    >
      {expiringCerts ? (
        outputTasks()
      ) : (
        <div className="mt-4 pt-4">
          <Dimmer active loader></Dimmer>
        </div>
      )}
    </div>
  );
};

async function getExpiringCertsTasks(
  months: TabProps['months']
): Promise<Map<string, string>[]> {
  return await DB.getExpiringCerts(months).then(({ data }: any) => {
    return data.map((item: any) => [item[0].id, item[1]]);
  });
}

function ExpiringCerts({ tasks }: ExpiringCertsProps) {
  const months: TabProps['months'][] = [12, 6, 3, 1, 0];
  return tasks.length ? (
    <div className="container">
      <ul
        className="nav nav-tabs nav-justified"
        id="expiringCertsTabs"
        role="tablist"
      >
        {months.map((month) => (
          <Tab key={month} months={month} />
        ))}
      </ul>
      <div className="tab-content" id="expiringCertsTabContent">
        {months.map((month) => (
          <TabContent key={month} tasks={tasks} months={month} />
        ))}
      </div>
    </div>
  ) : (
    <></>
  );
}

export default ExpiringCerts;
