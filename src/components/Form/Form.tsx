import { Component } from 'react';
import swal from 'sweetalert';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import * as B24 from 'B24/B24';
import Notification, { Status } from '../Notification/Notification';
import { emptyState, fabricAppFormInitState } from 'Task/emptyState';
import type { Payment, TaskState } from 'Task/Task.interface';
import DB from 'backend/DBManager';
import { TabbedCard, Button, Icon } from 'tabler-react';
import { GoBackOrHomeButton } from '../NaviButton';
import Dates from './Tabs/Dates';
import BasicInfo from './Tabs/BasicInfo/BasicInfo';
import CommentsNews from './Tabs/CommentsNews';
import FabricApplicationForm from './FabricAppForm/FabricApplicationForm';
import { renderStandards } from './Tabs/renderStandards';
import { getShippingLabelFile } from '../Export/PDF/ShippingLabelFile';
import Payments from './Payments';
import { Tab, Dimmer } from 'tabler-react';
import {
  changeActiveQuoteNo,
  changeTotalPrice,
  changeTask,
} from 'store/slices/mainSlice';
import { RootState } from 'store/store';
import { isEqual } from 'lodash';
import { AppFormExport } from '../Export/PDF/AppFormExport';
import { getTaskTotalPriceHelper } from 'helpers';

import { FileManagement } from 'components/FileManagement/FileManagement';

interface IFormState extends TaskState {
  requestStatus: Status;
  hasError?: boolean;
  existsInDB?: boolean;
}

class Form extends Component {
  state: IFormState;
  quoteNo?: Payment['quoteNo'];
  // @ts-expect-error
  props: any;

  constructor(props: any) {
    super(props);
    this.state = {
      ...emptyState,
      requestStatus: Status.FillingForm,
    };
  }

  componentDidUpdate = (prevProps: any) => {
    if (!isEqual(prevProps.allTasks, this.props.allTasks)) {
      const taskFromStore = this.props.allTasks.find(
        (t: any) => t.id === this.props.match.params.taskId
      );
      if (taskFromStore) {
        this.setState({
          ...taskFromStore.state,
          createdDate: taskFromStore.createdDate,
          accomplices: taskFromStore.accomplices,
          attachedFiles: taskFromStore.ufTaskWebdavFiles,
          link: `[URL=certreport.xmtextiles.com/edit/${this.props.match.params.taskId}/]this task[/URL]`,
        });
        this.props.changeTotalPrice(
          getTaskTotalPriceHelper(taskFromStore.state)
        );
      }
    }
  };

  async componentDidMount() {
    const taskFromStore = this.props.allTasks.find(
      (t: any) => t.id === this.props.match.params.taskId
    );
    if (taskFromStore) {
      this.props.changeTotalPrice(getTaskTotalPriceHelper(taskFromStore.state));
      this.setState({
        ...taskFromStore.state,
        createdDate: taskFromStore.createdDate,
        accomplices: taskFromStore.accomplices,
        attachedFiles: taskFromStore.ufTaskWebdavFiles,
        link: `[URL=certreport.xmtextiles.com/edit/${this.props.match.params.taskId}/]this task[/URL]`,
      });
    }

    if (this.props.match.params.taskId) {
      let { rem, ...data } = await DB.getFabricAppFormState(
        this.props.match.params.taskId
      );
      data = { ...fabricAppFormInitState, ...data };
      this.setState({
        FabricAppForm: data,
      });
    } else {
      this.setState({
        FabricAppForm: { ...fabricAppFormInitState },
      });
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

  async handleCert(e: React.SyntheticEvent) {
    e.preventDefault();
    const OK = await swal({
      title: 'Are you sure?',
      icon: 'info',
      buttons: ['Cancel', 'OK'],
    });

    if (OK) {
      this.setState({ requestStatus: Status.Loading });
      // update in Bitrix
      const taskId = this.props.match.params.taskId
        ? await B24.updateTask(
            {
              ...this.state,
              activeQuoteNo: this.props.activeQuoteNo,
              totalPrice: this.props.totalPrice,
            },
            this.props.match.params.taskId
          )
            .then((_) => this.props.match.params.taskId)
            .catch(this.unsuccessfullySubmitted)
        : await B24.createTask({
            ...this.state,
            activeQuoteNo: this.props.activeQuoteNo,
            totalPrice: this.props.totalPrice,
          }).catch(this.unsuccessfullySubmitted);

      // update in redux
      const task = await B24.getTask(taskId);
      this.props.changeTask({ id: taskId, task });

      // update in FaunaDB
      DB.createInstance(taskId, this.state.FabricAppForm)
        .then(this.successfullySubmitted)
        .catch((error: any) => {
          if (error.message === 'instance already exists') {
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
          }
        });

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

  unsuccessfullySubmitted = (error: unknown) => {
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
        href={`${process.env.REACT_APP_B24_HOST}/company/personal/user/460/tasks/task/view/${this.props.match.taskId}/`}
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
      {this.state.FabricAppForm && (
        <Button
          className="float-right"
          link
          onClick={(e: any) => {
            e.preventDefault();
            new AppFormExport(this.state).save();
          }}
        >
          Fabric Application Form <Icon prefix="fe" name="download" />
        </Button>
      )}
      <Notification status={this.state.requestStatus} />
      <form onSubmit={this.handleCert.bind(this)}>
        <TabbedCard initialTab="Basic Info">
          <Tab title="Basic Info">
            <BasicInfo
              {...this.state}
              handleChange={this.handleChange}
              asSelectable={this.asSelectable}
              handleSelectChange={this.handleSelectChange}
              handlePreTreatment1Change={this.handlePreTreatment1Change}
              setState={this.setState.bind(this)}
            ></BasicInfo>
          </Tab>
          <Tab title="Dates">
            <Dates
              calendarEventName={`${this.state.serialNumber}_${this.state.testingCompany}`}
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
              <Payments />
            </Dimmer>
          </Tab>
          {renderStandards.call(this)}
          <Tab title="Fabric Application Form">
            <Dimmer
              active={this.state.requestStatus !== Status.FillingForm}
              loader
            >
              <FabricApplicationForm
                baseState={this.state.FabricAppForm}
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
          <Tab title="Files">
            <FileManagement />
          </Tab>
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
    B24.getAttachedFiles(this.props.match.taskId as string).then((r: []) => {
      this.setState({ attachedFiles: r });
    });
}

export default connect(
  ({ main }: RootState) => ({ allTasks: main.allTasks }),
  {
    changeTask,
    changeActiveQuoteNo,
    changeTotalPrice,
  }
  // @ts-ignore
)(Form);
