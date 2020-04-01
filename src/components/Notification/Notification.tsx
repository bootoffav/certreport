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
    case Status.Success:
      return <div className="alert alert-success" role="alert">
        <h4 className="alert-heading">Success!</h4>
        <p>you are being redirected within 3 seconds!</p>
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