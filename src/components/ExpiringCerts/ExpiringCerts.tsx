import type { TaskState } from 'Task/Task.interface';
import './ExpiringCertsTab.css';

type ExpiringCertsProps = {
  tasks: TaskState[];
};

type TabProps = {
  months: 1 | 3 | 6;
};
const Tab = ({ months }: TabProps) => {
  return (
    <li className="nav-item" role="presentation">
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
  return (
    <div
      className="tab-pane fade show active"
      id={`months${months}`}
      role="tabpanel"
      aria-labelledby={`months${months}-tab`}
    >
      {months}
    </div>
  );
};

function ExpiringCerts({ tasks }: ExpiringCertsProps) {
  return (
    <div className="container">
      <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
        {([6, 3, 1] as const).map((month) => (
          <Tab months={month} />
        ))}
      </ul>
      <div className="tab-content" id="myTabContent">
        {([6, 3, 1] as const).map((month) => (
          <TabContent months={month} />
        ))}
      </div>
    </div>
  );
}

export default ExpiringCerts;
