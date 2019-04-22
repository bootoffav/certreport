import React from 'react';

export enum Status {
  FillingForm,
  Loading,
  Success,
  Failure
}

const Notification: React.FunctionComponent<{
  status: Status;
}> = ({ status }) => {
  switch (status) {
    case Status.Loading:
      return <div className="d-flex justify-content-end">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    case Status.Success:
      return <div className="alert alert-success" role="alert">
        <h4 className="alert-heading">Success!</h4>
        <p>You are being redirected to dashboard!</p>
      </div>
    case Status.Failure:
      return <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Failure</h4>
        <p>Try to update a bit later!</p>
      </div>
  }
  return <></>;
}

export default Notification;