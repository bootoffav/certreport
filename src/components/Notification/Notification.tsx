import * as React from 'react';
import Animated from '../../components/Animated';
export enum Status {
  Idle,
  Loading,
  Success,
  Failure,
}

const Notification: React.FunctionComponent<{
  status: Status;
}> = ({ status }) => {
  let notificationBlock = <></>;
  switch (status) {
    case Status.Success:
      notificationBlock = (
        <div className="alert alert-success" role="alert">
          <h4 className="alert-heading">Success!</h4>
          <p>redirecting you back!</p>
        </div>
      );
      break;
    case Status.Failure:
      notificationBlock = (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Failure</h4>
          <p>Try to save again in a few seconds!</p>
        </div>
      );
      break;
    case Status.Loading:
      notificationBlock = (
        <div className="alert alert-warning" role="alert">
          <h4 className="alert-heading">Updating</h4>
          <p>Hold on, do not make changes</p>
        </div>
      );
  }
  return <Animated>{notificationBlock}</Animated>;
};

export default Notification;
