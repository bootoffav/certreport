import { Price, Paid, QuoteNo, BaseInput } from './FormFields';
import dayjs from 'dayjs';
import type { Payment } from '../../Task/Task.interface';
import { localizePrice } from '../../helpers';
import { DBPayments } from '../../backend/DBPayments';
import { DB } from '../../backend/DBManager';
import React, { useState, useEffect } from 'react';

interface PaymentsProps {
  // payments: Payment[];
  taskId?: string;
}

function Payments({ taskId }: PaymentsProps) {
  const [payments, setPayments] = useState([] as Payment[]);
  // gets payments from DB
  useEffect(() => {
    taskId && DBPayments.get(taskId).then(setPayments);
  }, [taskId]);

  // save payments in DB on unmount
  // useEffect(() => {
  //   return function () {
  //     taskId && DB.updateInstance(taskId, { payments: [payments] }, 'payments');
  //   };
  // }, [payments]);

  const genericSetter = (
    location: string,
    value: string | boolean,
    index: number
  ): Payment[] => {
    payments[index][location] = value;
    return payments;
  };

  const renderPayment = (payment: Payment, index: number): JSX.Element => {
    const paymentPosition = index + 1;
    return (
      <div className="d-flex justify-content-center" key={paymentPosition}>
        <Price
          value={payment.price}
          label={`Payment #${paymentPosition}`}
          handleChange={(value) => {
            setPayments(() => {
              return [...genericSetter('price', value, index)];
            });
          }}
        />
        <Paid
          checked={payment.paid}
          onChange={({ target }) => {
            setPayments(() => {
              if (!target.checked) {
                payments[index].paymentDate = '';
              }
              return [...genericSetter('paid', target.checked, index)];
            });
          }}
          paymentDate={payment.paymentDate}
          paymentDateChange={(date) => {
            setPayments(() => {
              return [
                ...genericSetter(
                  'paymentDate',
                  dayjs(date).format('DDMMMYYYY'),
                  index
                ),
              ];
            });
          }}
        />
        <QuoteNo
          activeQuoteNo={payment.activeQuoteNo || false}
          handleActiveQuoteNoChange={() => {
            setPayments(() => {
              payments.forEach((p) => delete p.activeQuoteNo);
              return [...genericSetter('activeQuoteNo', true, index)];
            });
          }}
          value={payment.quoteNo}
          label="Quote No."
          onChange={({ currentTarget }) => {
            setPayments(() => {
              return [
                ...genericSetter(
                  'quoteNo',
                  (currentTarget as HTMLInputElement).value,
                  index
                ),
              ];
            });
          }}
        />
        <BaseInput
          className="ml-2"
          required={false}
          value={payment.proformaInvoiceNo}
          id={`proformaInvoiceNo${paymentPosition}`}
          label="PRO-FORMA INVOICE NO."
          handleChange={({ currentTarget }) => {
            setPayments(() => {
              return [
                ...genericSetter(
                  'proformaInvoiceNo',
                  (currentTarget as HTMLInputElement).value,
                  index
                ),
              ];
            });
          }}
        />
      </div>
    );
  };

  const total = payments.reduce((total, { price }) => total + Number(price), 0);
  return (
    <>
      {payments.map(renderPayment)}
      {renderTotal(total)}
    </>
  );
}

function renderTotal(total: number) {
  return (
    <div className="col-10 offset-1">
      <p className="text-right font-weight-bold">
        Total: {localizePrice(total)}
      </p>
    </div>
  );
}

export { Payments };
