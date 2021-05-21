import { Dimmer, Tab } from 'tabler-react';
import { BaseInput, Price, Paid, QuoteNo } from '../FormFields';
import { Status } from '../../Notification/Notification';
import { localizePrice } from '../../../helpers';

function renderPayments() {
  return (
    <Tab title="Payments">
      <Dimmer active={this.state.requestStatus !== Status.FillingForm} loader>
        {renderPayment.call(this, 1)}
        {renderPayment.call(this, 2)}
        <div className="col-10 offset-1">
          <p className="text-right font-weight-bold">
            Total: {localizePrice(+this.state.price1 + +this.state.price2)}
          </p>
        </div>
      </Dimmer>
    </Tab>
  );
}

/**
 * Render a line of payment fact at payments tab.
 * @param {number} time - which time it is paid
 */
function renderPayment(time: number) {
  return (
    <div className="d-flex justify-content-center">
      <Price
        value={this.state[`price${time}`]}
        id={`price${time}`}
        label={`Payment #${time}`}
        handleChange={this.handleChange}
      />
      <Paid
        id={`paid${time}`}
        checkboxState={this.state[`paid${time}`]}
        date={this.state[`paymentDate${time}`]}
        handleChange={(date: Date) =>
          this.handleDateChange(date, `paymentDate${time}`)
        }
        handleCheckboxChange={(e: any) => {
          if (!e.target.checked) {
            this.setState({ [`paymentDate${time}`]: null });
          }
          this.handleCheckboxChange(e);
        }}
      />
      <QuoteNo
        activeQuoteNo={this.state.activeQuoteNo}
        handleActiveQuoteNoChange={(id: string) => {
          this.setState({
            activeQuoteNo: id,
          });
        }}
        value={this.state[`quoteNo${time}`]}
        id={`quoteNo${time}`}
        label="Quote No."
        handleChange={this.handleChange}
      />
      <BaseInput
        className="ml-2"
        required={false}
        value={this.state[`proformaInvoiceNo${time}`]}
        id={`proformaInvoiceNo${time}`}
        label="PRO-FORMA INVOICE NO."
        handleChange={this.handleChange}
      />
    </div>
  );
}

export { renderPayments };

/* 2021-05-18 replace them by new fields: Quote No, PRO-FORMA INVOICE NO */
/* <Pi
id="proformaReceived"
checkboxState={this.state.proformaReceived}
proformaReceivedDate={this.state.proformaReceived}
date={this.state.proformaReceivedDate}
handleCheckboxChange={(e: any) => {
  if (!e.target.checked) {
    this.setState({ proformaReceivedDate: '', proformaNumber: '' });
  }
  this.handleCheckboxChange(e);
}}
handleDateChange={(date: any) =>
  this.handleDateChange(date, 'proformaReceivedDate')
}
handleNumberChange={(e: any) => this.handleChange(e)}
numberId={'proformaNumber'}
number={this.state.proformaNumber}
/> */
