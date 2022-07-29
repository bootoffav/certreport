import { Component } from 'react';
import swal from 'sweetalert';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import * as B24 from 'B24/B24';
import Notification, { Status } from '../Notification/Notification';
import { emptyState } from 'Task/emptyState';
import type { Payment, TaskState } from 'Task/Task.interface';
import DB from 'backend/DBManager';
import { TabbedCard, Button, Icon } from 'tabler-react';
import CacheManager from 'CacheManager';
import { GoBackOrHomeButton } from '../NaviButton';
import Dates from './Tabs/Dates';
import BasicInfo from './Tabs/BasicInfo/BasicInfo';
import { renderFiles } from './Tabs/Files';
import CommentsNews from './Tabs/CommentsNews';
import FabricApplicationForm from './FabricAppForm/FabricApplicationForm';
import { renderStandards } from './Tabs/renderStandards';
import { getShippingLabelFile } from '../Export/PDF/ShippingLabelFile';
import Payments from './Payments';
import { Tab, Dimmer } from 'tabler-react';
import { changeActiveQuoteNo, changeTotalPrice } from 'store/slices/mainSlice';
import { RootState } from 'store/store';
import { isEqual } from 'lodash';

interface IFormState extends TaskState {
  requestStatus: Status;
  hasError?: boolean;
  existsInDB?: boolean;
}

class Form extends Component {
  task_id: `${number}` | undefined;
  state: IFormState;
  quoteNo?: Payment['quoteNo'];
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

  componentDidUpdate = (prevProps: any) => {
    // if (!isEqual(prevProps.allTasks, this.props.allTasks)) {
    //   const taskFromStore = this.props.allTasks.find(
    //     (t: any) => t.id === this.task_id
    //   );
    //   this.setState({
    //     ...taskFromStore.state,
    //   });
    // }
    // if (taskFromStore) {
    //   this.quoteNo = (taskFromStore.state.payments as Payment[]).find(
    //     (payment) => payment.quoteNo
    //   )?.quoteNo;
    // }
    // this.props.changeActiveQuoteNo(this.quoteNo || '');
    // if (this.state.hasError) throw new Error('Task not found');
  };

  async componentDidMount() {
    const taskFromStore = this.props.allTasks.find(
      (t: any) => t.id === this.task_id
    );
    if (taskFromStore) {
      this.setState({
        ...taskFromStore.state,
        createdDate: taskFromStore.createdDate,
        accomplices: taskFromStore.accomplices,
        attachedFiles: taskFromStore.ufTaskWebdavFiles,
        link: `[URL=certreport.xmtextiles.com/edit/${this.task_id}/]this task[/URL]`,
      });
    }
    // if (this.task_id) {
    //   DB.getData(this.task_id)
    //     .then(({ exists, rem, ...FabricAppForm }: any) => {
    //       this.setState({
    //         FabricAppForm: { ...FabricAppForm },
    //         existsInDB: exists,
    //         rem: rem || emptyState.rem,
    //         requestStatus: Status.FillingForm,
    //         pretreatment2Active: Boolean(taskFromStore.state.pretreatment2),
    //       });
    //     })
    //     .catch((e) => this.setState({ hasError: true }));
    // }
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
          ...this.state.FabricAppForm,
        })
          .then(this.successfullySubmitted)
          .catch(this.unsuccessfullySubmitted);
      } else {
        DB.createInstance(taskId, this.state.FabricAppForm)
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
        <TabbedCard initialTab="Fabric Application Form">
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
              <Payments taskId={this.task_id} />
            </Dimmer>
          </Tab>
          {renderStandards.call(this)}
          <Tab title="Fabric Application Form">
            <Dimmer
              active={this.state.requestStatus !== Status.FillingForm}
              loader
            >
              <FabricApplicationForm
                // baseState={this.state.FabricAppForm}
                // appForm={this.state}
                updateParent={(FabricAppForm: any) => {
                  this.setState({ FabricAppForm });
                }}
              />
            </Dimmer>
          </Tab>
          <Tab title="Comments & News">
            <CommentsNews
              comments={this.state.comments}
              news={this.state.news}
              handleChange={this.handleChange}
              requestStatus={this.state.requestStatus}
            />
          </Tab>
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

export default connect(
  ({ main }: RootState) => ({ allTasks: main.allTasks }),
  {
    changeActiveQuoteNo,
    changeTotalPrice,
  }
  // @ts-ignore
)(Form);
