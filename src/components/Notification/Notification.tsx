import React from 'react';

interface Props {
  result: boolean;
}

const Notification: React.FunctionComponent<Props> = ({result}) =>
    result
    ? <div className="alert alert-success" role="alert">
        <h4 className="alert-heading">Success!</h4>
        <p>You are being redirected to dashboard!</p>
      </div>
    : <div className="alert alert-danger" role="alert">
        <h4 className="alert-heading">Failure</h4>
        <p>Try to update a bit later!</p>
      </div>

export default Notification;