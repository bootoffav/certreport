import React from 'react';
import Loader from 'react-loader-spinner';

export enum Status {
  FillingForm,
  Loading,
  Success,
  Failure
}

interface Props {
  status: Status;
}

class Notification extends React.Component<Props, {}> {
  render() {
    switch (this.props.status) {
      case Status.Loading:
        return <div className="d-flex flex-row-reverse">
                 <Loader color='blueviolet' type="Circles" height={40} width={40}/>
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
}

export { Notification as default };