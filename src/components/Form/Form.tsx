import * as React from 'react';
import swal from 'sweetalert';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { BaseInput } from './FormFields';
import * as B24 from '../../B24/B24';
import Notification, { Status } from '../Notification/Notification';
import { IState, emptyState } from '../../Task/emptyState';
import { Standards } from '../Standards/Standards';
import { FileManagement } from '../FileManagement/FileManagement';
import { FabricApplicationForm } from './FabricApplicationForm';
import { DB } from '../../DBManager';
import { TabbedCard, Tab, Dimmer, Button } from 'tabler-react';
import { PreTreatment1 } from './PreTreatment1';
import CacheManager from '../../CacheManager';
import { GoBackOrHomeButton } from '../NaviButton';
import { renderDates } from './Tabs/Dates';
import { renderPayments } from './Tabs/Payments';
import { renderBasicInfo } from './Tabs/BasicInfo';

interface IFormState extends IState {
  requestStatus: Status;
  hasError?: boolean;
  existsInDB?: boolean;
}

class Form extends React.Component {
  task_id: string | undefined;
  state: IFormState;
  props: any;

  constructor(props: any) {
    super(props);
    this.task_id = props.match.params.id;
    this.state = {
      ...emptyState,
      requestStatus: Status.FillingForm,
    };
  }

  componentDidUpdate = () => {
    if (this.state.hasError) throw new Error('Task not found');
  };

  async componentDidMount() {
    if (this.task_id) {
      this.setState({ requestStatus: Status.Loading });
      const dataFromDB = await DB.getData(this.task_id).then(
        ({
          exists,
          rem,
          quoteNo1,
          quoteNo2,
          proformaInvoiceNo1,
          proformaInvoiceNo2,
          ...DBState
        }: any) => ({
          DBState,
          quoteNo1,
          quoteNo2,
          proformaInvoiceNo1,
          proformaInvoiceNo2,
          rem,
          exists,
        })
      );

      await B24.getTask(this.task_id)
        .then((r: any) => {
          this.setState({
            ...r.state,
            attachedFiles: r.ufTaskWebdavFiles,
            link: `[URL=certreport.xmtextiles.com/edit/${this.task_id}/]this task[/URL]`,
            DBState: dataFromDB.DBState,
            existsInDB: dataFromDB.exists,
            rem: dataFromDB.rem || emptyState.rem,
            quoteNo1: dataFromDB.quoteNo1 ?? emptyState.quoteNo1,
            quoteNo2: dataFromDB.quoteNo2 ?? emptyState.quoteNo2,
            proformaInvoiceNo1:
              dataFromDB.proformaInvoiceNo1 ?? emptyState.proformaInvoiceNo1,
            proformaInvoiceNo2:
              dataFromDB.proformaInvoiceNo2 ?? emptyState.proformaInvoiceNo2,
            requestStatus: Status.FillingForm,
          });
        })
        .catch((e) => this.setState({ hasError: true }));
    }
  }

  handleDateChange = (date: Date | null, prop: string): void =>
    this.setState({
      [prop]: date === null ? '' : dayjs(date).format('DDMMMYYYY'),
    });

  handleCheckboxChange = ({ currentTarget }: React.SyntheticEvent): void =>
    this.setState({
      [currentTarget.id]: (currentTarget as HTMLInputElement).checked,
    });

  handleSelectChange = (
    selected: {
      label: string;
      value: string;
    }[],
    id: string
  ) => {
    selected = Array.isArray(selected) ? selected : [selected];
    this.setState({
      [id]: selected.reduce(
        (endValue, currentValue, index) =>
          index === selected.length - 1
            ? `${endValue}${currentValue.label}`
            : `${endValue}${currentValue.label}, `,
        ''
      ),
    });
  };

  handleChange = (e: any) => this.setState({ [e.target.id]: e.target.value });

  handlePreTreatment1Change = (value: string) =>
    this.setState({ pretreatment1Result: value });

  async handleCert(e: any) {
    e.preventDefault();
    const OK = await swal({
      title: 'Are you sure?',
      icon: 'info',
      buttons: ['Cancel', 'OK'],
    });

    if (OK) {
      this.setState({ requestStatus: Status.Loading });
      // update in Bitrix
      const taskId = this.task_id
        ? await B24.updateTask(this.state, this.task_id)
            .then((_) => this.task_id)
            .catch(this.unsuccessfullySubmitted)
        : await B24.createTask(this.state).catch(this.unsuccessfullySubmitted);

      // update in indexedDB
      await CacheManager.updateTask(taskId);

      // update in FaunaDB
      this.state.existsInDB
        ? DB.updateInstance(taskId, {
            rem: this.state.rem,
            quoteNo1: this.state.quoteNo1,
            quoteNo2: this.state.quoteNo2,
            proformaInvoiceNo1: this.state.proformaInvoiceNo1,
            proformaInvoiceNo2: this.state.proformaInvoiceNo2,
            ...this.state.DBState,
          })
            .then(this.successfullySubmitted)
            .catch(this.unsuccessfullySubmitted)
        : DB.createInstance(taskId, this.state.DBState)
            .then(this.successfullySubmitted)
            .catch(this.unsuccessfullySubmitted);
    }
  }

  asSelectable = (value: string) => {
    if (value !== '') {
      const splitted: string[] = value.split(', ');
      return splitted.length === 1
        ? [{ label: value, value }]
        : splitted.map((label) => ({ label, value: label }));
    }
  };

  successfullySubmitted = () => {
    this.setState({ requestStatus: Status.Success });
    this.props.history.goBack();
  };

  unsuccessfullySubmitted = (error: any) => {
    console.log(error);
    this.setState({ requestStatus: Status.Failure });
    setTimeout(
      () =>
        this.setState({
          requestStatus: Status.FillingForm,
        }),
      1500
    );
  };

  renderStandards = () => (
    <Dimmer active={this.state.requestStatus !== Status.FillingForm} loader>
      <Standards
        initStandards={this.state.standards.split(', ')}
        taskId={this.task_id || ''}
        setState={this.setState.bind(this)}
      />
      <PreTreatment1
        pretreatment1={this.state.pretreatment1}
        result={this.state.pretreatment1Result}
        handleChange={this.handleChange}
        resultChange={this.handlePreTreatment1Change}
      />
    </Dimmer>
  );

  render = () => (
    <div className="container mt-2">
      <Button
        RootComponent="a"
        href={`https://xmtextiles.bitrix24.ru/company/personal/user/460/tasks/task/view/${this.task_id}/`}
        target="_blank"
        rel="noopener noreferrer"
        link
        className="float-right"
      >
        Task in B24
      </Button>
      <Notification status={this.state.requestStatus} />
      <form onSubmit={(e) => this.handleCert(e)}>
        <TabbedCard initialTab="Basic Info">
          <Tab title="Basic Info">{renderBasicInfo.call(this)}</Tab>
          <Tab title="Dates">{renderDates.call(this)}</Tab>
          <Tab title="Payments">{renderPayments.call(this)}</Tab>
          <Tab title="Standards">{this.renderStandards()}</Tab>
          <Tab title="Fabric Application Form">
            <Dimmer
              active={this.state.requestStatus !== Status.FillingForm}
              loader
            >
              <FabricApplicationForm
                state={this.state.DBState}
                appForm={this.state}
                updateParent={(DBState: any) => this.setState({ DBState })}
              />
            </Dimmer>
          </Tab>
          <Tab title="Comments & News">
            <Dimmer
              active={this.state.requestStatus !== Status.FillingForm}
              loader
            >
              <div className="form-row">
                <BaseInput
                  required={false}
                  value={this.state.news}
                  className="w-100"
                  id="news"
                  label="News:"
                  handleChange={this.handleChange}
                />
              </div>
              <div className="form-row">
                <label htmlFor="comments">Comments:</label>
                <textarea
                  className="form-control"
                  value={this.state.comments}
                  id="comments"
                  rows={15}
                  onChange={this.handleChange}
                />
              </div>
            </Dimmer>
          </Tab>
          {this.task_id && (
            <Tab title="Files">
              <Dimmer
                active={this.state.requestStatus !== Status.FillingForm}
                loader
              >
                <FileManagement
                  taskId={this.task_id}
                  attachedFiles={this.state.attachedFiles}
                  updateAttachedFiles={() => this.updateAttachedFiles()}
                />
              </Dimmer>
            </Tab>
          )}
        </TabbedCard>
        <div className="d-flex justify-content-around">
          <button type="submit" className="col-2 btn btn-primary">
            Save changes
          </button>
          <GoBackOrHomeButton />
        </div>
      </form>
    </div>
  );

  updateAttachedFiles = () =>
    B24.getAttachedFiles(this.task_id as string).then((r: []) => {
      this.setState({ attachedFiles: r });
    });
}

export { Form };
