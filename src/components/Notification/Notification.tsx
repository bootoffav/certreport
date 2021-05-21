import * as React from 'react';

export enum Status {
  FillingForm,
  Loading,
  Success,
  Failure,
}

const Notification: React.FunctionComponent<{
  status: Status;
}> = ({ status }) => {
  switch (status) {
    case Status.Success:
      return (
        <div className="alert alert-success" role="alert">
          <h4 className="alert-heading">Success!</h4>
          <p>redirecting you back!</p>
        </div>
      );
    case Status.Failure:
      return (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Failure</h4>
          <p>Try to save again in a few seconds!</p>
        </div>
      );
  }
  return <></>;
};

export default Notification;
