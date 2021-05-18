import { Dimmer } from 'tabler-react';
import { BaseInput, Price, Paid } from '../FormFields';
import { Status } from '../../Notification/Notification';
import { localizePrice } from '../../../helpers';

function renderPayments() {
  return (
    <Dimmer active={this.state.requestStatus !== Status.FillingForm} loader>
      <div className="d-flex justify-content-center">
        <Price
          value={this.state.price}
          id="price"
          label="Payment #1"
          handleChange={this.handleChange}
        />
        <Paid
          id="paid"
          checkboxState={this.state.paid}
          date={this.state.paymentDate}
          handleChange={(date: any) =>
            this.handleDateChange(date, 'paymentDate')
          }
          handleCheckboxChange={(e: any) => {
            if (!e.target.checked) {
              this.setState({ paymentDate: null });
            }
            this.handleCheckboxChange(e);
          }}
        />

        <BaseInput
          required={false}
          value={this.state.quoteNo1}
          id="quoteNo1"
          label="Quote No."
          handleChange={this.handleChange}
        />
        <BaseInput
          required={false}
          value={this.state.proformaInvoiceNo1}
          id="proformaInvoiceNo1"
          label="PRO-FORMA INVOICE NO."
          handleChange={this.handleChange}
        />

        {/* 2021-05-18 replace them by new fields: Quote No, PRO-FORMA INVOICE NO */}
        {/* <Pi
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
        /> */}
      </div>

      <div className="d-flex justify-content-center">
        <Price
          value={this.state.price2}
          id="price2"
          label="Payment #2"
          handleChange={this.handleChange}
        />
        <Paid
          id="paid2"
          checkboxState={this.state.paid2}
          date={this.state.paymentDate2}
          handleChange={(date: Date) =>
            this.handleDateChange(date, 'paymentDate2')
          }
          handleCheckboxChange={(e: any) => {
            if (!e.target.checked) {
              this.setState({ paymentDate2: null });
            }
            this.handleCheckboxChange(e);
          }}
        />

        <BaseInput
          required={false}
          value={this.state.quoteNo2}
          id="quoteNo2"
          label="Quote No."
          handleChange={this.handleChange}
        />
        <BaseInput
          required={false}
          value={this.state.proformaInvoiceNo2}
          id="proformaInvoiceNo2"
          label="PRO-FORMA INVOICE NO."
          handleChange={this.handleChange}
        />
        {/* 2021-05-18 replace them by new fields: Quote No, PRO-FORMA INVOICE NO */}
        {/* <Pi
          id="proformaReceived2"
          checkboxState={this.state.proformaReceived2}
          proformaReceivedDate={this.state.proformaReceived2}
          date={this.state.proformaReceivedDate2}
          handleCheckboxChange={(e: any) => {
            if (!e.target.checked) {
              this.setState({ proformaReceivedDate2: '', proformaNumber2: '' });
            }
            this.handleCheckboxChange(e);
          }}
          handleDateChange={(date: Date) =>
            this.handleDateChange(date, 'proformaReceivedDate2')
          }
          handleNumberChange={(e: React.SyntheticEvent) => this.handleChange(e)}
          numberId={'proformaNumber2'}
          number={this.state.proformaNumber2}
        /> */}
      </div>

      <div className="col-10 offset-1">
        <p className="text-right font-weight-bold">
          Total: {localizePrice(+this.state.price + +this.state.price2)}
        </p>
      </div>
    </Dimmer>
  );
}

export { renderPayments };
