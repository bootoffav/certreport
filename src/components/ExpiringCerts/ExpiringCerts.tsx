import type { TaskState } from 'Task/Task.interface';
import './ExpiringCertsTab.css';

type ExpiringCertsProps = {
  tasks: TaskState[];
};

function ExpiringCerts({ tasks }: ExpiringCertsProps) {
  return (
    <div className="container">
      <ul className="nav nav-tabs nav-justified" id="myTab" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active mx-auto expiringCertsTab"
            id="months6-tab"
            data-bs-toggle="tab"
            data-bs-target="#months6"
            type="button"
            role="tab"
            aria-controls="months6"
            aria-selected="true"
          >
            6 months
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link mx-auto expiringCertsTab"
            id="months3-tab"
            data-bs-toggle="tab"
            data-bs-target="#months3"
            type="button"
            role="tab"
            aria-controls="months3"
            aria-selected="false"
          >
            3 months
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link mx-auto expiringCertsTab"
            id="month1-tab"
            data-bs-toggle="tab"
            data-bs-target="#month1"
            type="button"
            role="tab"
            aria-controls="month1"
            aria-selected="false"
          >
            1 month
          </button>
        </li>
      </ul>
      <div className="tab-content" id="myTabContent">
        <div
          className="tab-pane fade show active"
          id="months6"
          role="tabpanel"
          aria-labelledby="months6-tab"
        >
          6
        </div>
        <div
          className="tab-pane fade"
          id="months3"
          role="tabpanel"
          aria-labelledby="months3-tab"
        >
          3
        </div>
        <div
          className="tab-pane fade"
          id="month1"
          role="tabpanel"
          aria-labelledby="month1-tab"
        >
          1
        </div>
      </div>
    </div>
  );
}

export default ExpiringCerts;
