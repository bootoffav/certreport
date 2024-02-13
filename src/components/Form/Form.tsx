import { useParams, useNavigate } from 'react-router-dom';
import { Component } from 'react';
import swal from 'sweetalert';
import 'react-datepicker/dist/react-datepicker.css';
import dayjs from 'dayjs';
import { connect } from 'react-redux';
import * as B24 from '../../B24/B24';
import Notification, { Status } from '../Notification/Notification';
import { emptyState, fabricAppFormInitState } from '../../Task/emptyState';
import type { Payment, TaskState } from '../../Task/Task.interface';
import DB from '../../backend/DBManager';
import { TabbedCard, Button, Icon, Tab } from 'tabler-react';
import GoBackButton from '../GoBackButton';
import Dates from './Tabs/Dates';
import BasicInfo from './Tabs/BasicInfo/BasicInfo';
import CommentsNews from './Tabs/CommentsNews';
import FabricApplicationForm from './FabricAppForm/FabricApplicationForm';
import { renderStandards } from './Tabs/renderStandards';
import { getShippingLabelFile } from '../Export/PDF/ShippingLabelFile';
import Payments from './Payments';
import {
  changeActiveQuoteNo,
  changeTotalPrice,
  changeTask,
} from '../../store/slices/mainSlice';
import { RootState } from '../../store/store';
import { isEqual } from 'lodash';
import { AppFormExport } from '../Export/PDF/AppFormExport';
import { getTaskTotalPriceHelper } from '../../helpers';

import { FileManagement } from '../../components/FileManagement/FileManagement';

interface IFormState extends TaskState {
  requestStatus: Status;
  hasError?: boolean;
  existsInDB?: boolean;
}

class Form extends Component<any> {
  state: IFormState;
  quoteNo?: Payment['quoteNo'];

  constructor(props: any) {
    super(props);
    this.state = {
      ...emptyState,
      requestStatus: Status.Idle,
    };
  }

  componentDidUpdate = (prevProps: any) => {
    if (!isEqual(prevProps.allTasks, this.props.allTasks)) {
      const taskFromStore = this.props.allTasks.find(
        (t: any) => t.id === this.props.taskId
      );
      if (taskFromStore) {
        this.setState({
          ...taskFromStore.state,
          createdDate: taskFromStore.createdDate,
          accomplices: taskFromStore.accomplices,
          attachedFiles: taskFromStore.ufTaskWebdavFiles,
          link: `[URL=certreport.xmtextiles.com/edit/${this.props.taskId}/]this task[/URL]`,
        });
        this.props.changeTotalPrice(
          getTaskTotalPriceHelper(taskFromStore.state)
        );
      }
    }
  };

  async componentDidMount() {
    const taskFromStore = this.props.allTasks.find(
      (t: any) => t.id === this.props.taskId
    );
    if (taskFromStore) {
      this.props.changeTotalPrice(getTaskTotalPriceHelper(taskFromStore.state));
      this.setState({
        ...taskFromStore.state,
        createdDate: taskFromStore.createdDate,
        accomplices: taskFromStore.accomplices,
        attachedFiles: taskFromStore.ufTaskWebdavFiles,
        link: `[URL=certreport.xmtextiles.com/edit/${this.props.taskId}/]this task[/URL]`,
      });
    }

    if (this.props.taskId) {
      let { rem, ...data } = await DB.getFabricAppFormState(this.props.taskId);
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
      const taskId = this.props.taskId
        ? await B24.updateTask(
            {
              ...this.state,
              activeQuoteNo: this.props.activeQuoteNo,
              totalPrice: this.props.totalPrice,
              factory: this.props.factory,
            },
            this.props.taskId
          )
            .then((_) => this.props.taskId)
            .catch(this.unsuccessfullySubmitted)
        : await B24.createTask({
            ...this.state,
            activeQuoteNo: this.props.activeQuoteNo,
            totalPrice: this.props.totalPrice,
            factory: this.props.factory,
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
    setTimeout(() => this.props.navigate('/'), 1000);
  };

  unsuccessfullySubmitted = (error: unknown) => {
    console.log(error);
    this.setState({ requestStatus: Status.Failure });
    setTimeout(
      () =>
        this.setState({
          requestStatus: Status.Idle,
        }),
      1500
    );
  };

  render = () => {
    return (
      <div className="container mt-2">
        <Button
          RootComponent="a"
          href={`${
            import.meta.env.VITE_B24_HOST
          }/company/personal/user/460/tasks/task/view/${this.props.taskId}/`}
          target="_blank"
          rel="noopener noreferrer"
          link
          className="float-right"
        >
          Task in B24
        </Button>
        {this.state.requestStatus === Status.Idle && (
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
        {this.state.requestStatus !== Status.Idle && (
          <Notification status={this.state.requestStatus} />
        )}
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
              <Payments />
            </Tab>
            {renderStandards.call(this)}
            <Tab title="Fabric Application Form">
              <FabricApplicationForm
                baseState={this.state.FabricAppForm}
                updateParent={(FabricAppForm: any) => {
                  this.setState({ FabricAppForm });
                }}
              />
            </Tab>
            <Tab title="Comments & News">
              <CommentsNews
                comments={this.state.comments}
                news={this.state.news}
                handleChange={this.handleChange}
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
            <GoBackButton />
          </div>
        </form>
      </div>
    );
  };
  updateAttachedFiles = () =>
    B24.getAttachedFiles(this.props.taskId).then((r: []) => {
      this.setState({ attachedFiles: r });
    });
}

export default withRouter(
  connect(
    ({ main, form }: RootState) => ({
      allTasks: main.allTasks,
      factory: form.factory,
    }),
    {
      changeTask,
      changeActiveQuoteNo,
      changeTotalPrice,
    }
  )(Form)
);

export function withRouter(Children: any) {
  return (props: any) => {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();
    return <Children {...props} taskId={taskId} navigate={navigate} />;
  };
}
