import { Icon } from 'tabler-react';
import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { Price, Paid, QuoteNo, BaseInput } from './FormFields';
import type { Payment } from 'Task/Task.interface';
import { localizePrice } from 'helpers';
import DB from 'backend/DBManager';
import { useDispatch } from 'react-redux';
import { changeActiveQuoteNo, changeTotalPrice } from 'store';

interface PaymentsProps {
  payments: Payment[];
  taskId?: string;
}

const emptyPayment: Payment = {
  price: '',
  paid: false,
  paymentDate: '',
  quoteNo: '',
  proformaInvoiceNo: '',
};

function removeEmptyPaymentsBeforeSave(payments: Payment[]): Payment[] {
  return payments.filter((payment) => {
    for (const prop in emptyPayment) {
      if (payment[prop] !== emptyPayment[prop]) return true;
    }
    return false;
  });
}

function Payments({ taskId, ...props }: PaymentsProps) {
  const [payments, setPayments] = useState([] as Payment[]);

  const dispatch = useDispatch();

  // gets payments from DB
  useEffect(() => {
    (async function () {
      if (taskId) {
        const payments = await DB.get(taskId, 'payments', 'payments');
        if (props.payments.length > 0) {
          // исключить повторные оплаты (сранивание по price)
          // возникают при получении данных из Б24 и faunaDB
          props.payments.forEach(({ price }) => {
            const index = payments.findIndex((p: Payment) => p.price === price);
            if (index !== -1) {
              payments.splice(index, 1);
            }
          });
        }
        setPayments([...props.payments, ...payments]);
      }
    })();
  }, [taskId, props.payments, dispatch]);

  // save payments in DB on unmount
  useEffect(() => {
    return function () {
      const filteredPayments = payments.length
        ? // clear out emptyPayments
          removeEmptyPaymentsBeforeSave(payments)
        : payments;

      taskId &&
        filteredPayments.length &&
        DB.updateInstance(taskId, { payments: filteredPayments }, 'payments');
    };
  }, [taskId, payments]);

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
            dispatch(changeActiveQuoteNo({ value: payment.quoteNo }));
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
        <RemovePayment
          doIt={(e) => {
            e.preventDefault();
            setPayments((payments) => {
              payments.splice(index, 1);
              return [...payments];
            });
          }}
        />
      </div>
    );
  };

  const totalPrice = payments.reduce(
    (total, { price }) => total + Number(price),
    0
  );
  dispatch(
    changeTotalPrice({
      value: totalPrice,
    })
  );

  return (
    <>
      {payments.map(renderPayment)}
      <AddPayment
        doIt={(e) => {
          e.preventDefault();
          setPayments((payments) => [...payments, { ...emptyPayment }]);
        }}
      />
      {renderTotal(totalPrice)}
    </>
  );
}

interface AddRemovePaymentProps {
  doIt: (e: React.SyntheticEvent) => void;
}

function RemovePayment({ doIt }: AddRemovePaymentProps) {
  return (
    <div
      className="ml-2 d-flex align-items-center"
      style={{ fontSize: '1.2rem' }}
    >
      <Icon className="redIcon" link onClick={doIt} name="trash-2" />
    </div>
  );
}

function AddPayment({ doIt }: AddRemovePaymentProps) {
  return (
    <span style={{ fontSize: '1.2rem' }}>
      <Icon link onClick={doIt} name="plus-circle" />
    </span>
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
