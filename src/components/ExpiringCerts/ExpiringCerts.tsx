import { Link } from 'react-router-dom';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import type { TaskState } from 'Task/Task.interface';
import './ExpiringCertsTab.css';
import DB from 'backend/DBManager';

type ExpiringCertsProps = {
  tasks: TaskState[];
};

type TabProps = {
  months: 1 | 3 | 6;
};

const Tab = ({ months }: TabProps) => {
  return (
    <li className="nav-item" role="presentation" key={months}>
      <button
        className={`nav-link ${
          months === 6 ? 'active' : ''
        } mx-auto expiringCertsTab`}
        id={`months${months}-tab`}
        data-bs-toggle="tab"
        data-bs-target={`#months${months}`}
        type="button"
        role="tab"
        aria-controls={`months${months}`}
        aria-selected="true"
      >
        {months} month{months !== 1 ? 's' : ''}
      </button>
    </li>
  );
};

const TabContent = ({ months }: TabProps) => {
  const [expiringCerts, setExpiringCerts] = useState<any[]>();
  useEffect(() => {
    (async () => {
      const certs = await getExpiringCertsTasks(months);
      setExpiringCerts(certs);
    })();
  }, [months]);

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
          <th scope="col">Task in B24</th>
          <th scope="col">Edit task</th>
        </tr>
      </thead>
      <tbody>
        {expiringCerts?.map((task: any, index) => {
          return (
            <tr key={index}>
              <th scope="row">{index + 1}</th>
              <td>{dayjs(task[1]).format('DDMMMYYYY')}</td>
              <td>
                <a
                  href={`${process.env.REACT_APP_B24_HOST}/company/personal/user/460/tasks/task/view/${task[0]}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {task[0]}
                </a>
              </td>
              <td>
                <Link
                  to={`/edit/${task[0]}`}
                  style={{ textDecoration: 'none' }}
                >
                  {task[0]}
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
      className={`tab-pane fade show ${months === 6 ? 'active' : ''}`}
      id={`months${months}`}
      role="tabpanel"
      aria-labelledby={`months${months}-tab`}
    >
      {expiringCerts ? outputTasks() : <>loading</>}
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
  // debugger;
  // useEffect(() => {
  //   if (tasks.length > 0) {
  //     tasks.forEach((t) => {
  //       console.log(t.id);
  //     });
  //   }
  // }, [tasks]);

  return (
    <div className="container">
      <ul
        className="nav nav-tabs nav-justified"
        id="expiringCertsTabs"
        role="tablist"
      >
        {([6, 3, 1] as const).map((month) => (
          <Tab key={month} months={month} />
        ))}
      </ul>
      <div className="tab-content" id="expiringCertsTabContent">
        {([6, 3, 1] as const).map((month) => (
          <TabContent key={month} months={month} />
        ))}
      </div>
    </div>
  );
}

export default ExpiringCerts;
