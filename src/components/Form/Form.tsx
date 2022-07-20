import { Component } from 'react';
import swal from 'sweetalert';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import * as B24 from 'B24/B24';
import Notification, { Status } from '../Notification/Notification';
import { emptyState } from 'Task/emptyState';
import type { TaskState } from 'Task/Task.interface';
import DB from 'backend/DBManager';
import { TabbedCard, Button, Icon } from 'tabler-react';
import CacheManager from 'CacheManager';
import { GoBackOrHomeButton } from '../NaviButton';
import Dates from './Tabs/Dates';
import BasicInfo from './Tabs/BasicInfo/BasicInfo';
import { renderFiles } from './Tabs/Files';
import { renderCommentsNews } from './Tabs/CommentsNews';
import { renderFabricApplicationForm } from './Tabs/FabricApplicationForm';
import { renderStandards } from './Tabs/renderStandards';
import { getShippingLabelFile } from '../Export/PDF/ShippingLabelFile';
import Payments from './Payments';
import { Tab, Dimmer } from 'tabler-react';
import { changeActiveQuoteNo, changeTotalPrice } from 'store/slices/mainSlice';
import type { Payment } from '../../Task/Task.interface';

interface IFormState extends TaskState {
  requestStatus: Status;
  hasError?: boolean;
  existsInDB?: boolean;
}

class Form extends Component {
  task_id: `${number}` | undefined;
  state: IFormState;
  // @ts-expect-error
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
      this.setState({
        requestStatus: Status.Loading,
      });
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

      // put activeQuoteNo into react store
      const payments: Payment[] = await DB.get(
        this.task_id,
        ['data', 'payments'],
        'payments'
      ).catch((e) => []);

      const found = payments.find((p: any) => p.activeQuoteNo);
      this.props.changeActiveQuoteNo(found ? found.quoteNo : '');

      await B24.getTask(this.task_id)
        .then((r: any) => {
          this.setState({
            ...r.state,
            createdDate: r.createdDate,
            accomplices: r.accomplices,
            attachedFiles: r.ufTaskWebdavFiles,
            link: `[URL=certreport.xmtextiles.com/edit/${this.task_id}/]this task[/URL]`,
            DBState: dataFromDB.DBState,
            existsInDB: dataFromDB.exists,
            rem: dataFromDB.rem || emptyState.rem,
            requestStatus: Status.FillingForm,
            pretreatment2Active: Boolean(r.state.pretreatment2),
          });
          if (this.state.payments.length > 0) {
            this.setState((state: TaskState) => {
              const payments = [];
              payments.push({
                ...state.payments[0],
                quoteNo: dataFromDB.quoteNo1,
                proformaInvoiceNo: dataFromDB.proformaInvoiceNo1,
              });
              if (this.state.payments.length > 1) {
                payments.push({
                  ...state.payments[1],
                  quoteNo: dataFromDB.quoteNo2,
                  proformaInvoiceNo: dataFromDB.proformaInvoiceNo2,
                });
              }
              return {
                payments,
              };
            });
          }
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
        ? await B24.updateTask(
            {
              ...this.state,
              activeQuoteNo: this.props.activeQuoteNo,
              totalPrice: this.props.totalPrice,
            },
            this.task_id
          )
            .then((_) => this.task_id)
            .catch(this.unsuccessfullySubmitted)
        : await B24.createTask({
            ...this.state,
            activeQuoteNo: this.props.activeQuoteNo,
            totalPrice: this.props.totalPrice,
          }).catch(this.unsuccessfullySubmitted);

      // update in indexedDB
      await CacheManager.updateTask(taskId);

      // update in FaunaDB
      if (this.state.existsInDB) {
        DB.updateInstance(taskId, {
          rem: this.state.rem,
          quoteNo1: this.state.quoteNo1,
          quoteNo2: this.state.quoteNo2,
          activeQuoteNo: this.state.activeQuoteNo,
          proformaInvoiceNo1: this.state.proformaInvoiceNo1,
          proformaInvoiceNo2: this.state.proformaInvoiceNo2,
          ...this.state.DBState,
        })
          .then(this.successfullySubmitted)
          .catch(this.unsuccessfullySubmitted);
      } else {
        DB.createInstance(taskId, this.state.DBState)
          .then(this.successfullySubmitted)
          .catch(this.unsuccessfullySubmitted);
      }
      DB.updateInstance(
        taskId,
        { factory: this.state.factory },
        'certification'
      );
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
    setTimeout(() => this.props.history.goBack(), 1000);
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

  render = () => (
    <div className="container mt-2">
      <Button
        RootComponent="a"
        href={`${process.env.REACT_APP_B24_HOST}/company/personal/user/460/tasks/task/view/${this.task_id}/`}
        target="_blank"
        rel="noopener noreferrer"
        link
        className="float-right"
      >
        Task in B24
      </Button>
      {this.state.requestStatus === Status.FillingForm && (
        <Button
          className="float-right"
          link
          onClick={(e: any) => {
            e.preventDefault();
            getShippingLabelFile({
              ...this.state,
              activeQuoteNo: this.props.activeQuoteNo,
            });
          }}
        >
          Shipping label <Icon prefix="fe" name="download" />
        </Button>
      )}
      <Notification status={this.state.requestStatus} />
      <form onSubmit={(e) => this.handleCert(e)}>
        <TabbedCard initialTab="Basic Info">
          <Tab title="Basic Info">
            <BasicInfo
              {...this.state}
              handleChange={this.handleChange}
              asSelectable={this.asSelectable}
              handleSelectChange={this.handleSelectChange}
              handlePreTreatment1Change={this.handlePreTreatment1Change}
              taskId={this.task_id}
              setState={this.setState.bind(this)}
            ></BasicInfo>
          </Tab>
          <Tab title="Dates">
            <Dates
              calendarEventName={`${this.state.serialNumber}_${this.state.testingCompany}`}
              taskId={this.task_id}
              pausedUntil={this.state.pausedUntil}
              requestStatus={this.state.requestStatus}
              readyOn={this.state.readyOn}
              sentOn={this.state.sentOn}
              receivedOn={this.state.receivedOn}
              startedOn={this.state.startedOn}
              testFinishedOnPlanDate={this.state.testFinishedOnPlanDate}
              testFinishedOnRealDate={this.state.testFinishedOnRealDate}
              certReceivedOnPlanDate={this.state.certReceivedOnPlanDate}
              certReceivedOnRealDate={this.state.certReceivedOnRealDate}
              stage={this.state.stage}
              handleDateChange={this.handleDateChange}
            />
          </Tab>
          <Tab title="Payments">
            <Dimmer
              active={this.state.requestStatus !== Status.FillingForm}
              loader
            >
              <Payments payments={this.state.payments} taskId={this.task_id} />
            </Dimmer>
          </Tab>
          {renderStandards.call(this)}
          {renderFabricApplicationForm.call(this)}
          {renderCommentsNews.call(this)}
          {this.task_id && renderFiles.call(this)}
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

export default connect(null, {
  changeActiveQuoteNo,
  changeTotalPrice,
  // @ts-ignore
})(Form);
