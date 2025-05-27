import { Icon } from 'tabler-react';
import { useCallback, useEffect } from 'react';
import dayjs from 'dayjs';
import { Price, Paid, QuoteNo, BaseInput } from './FormFields';
import type { Payment } from '../../Task/Task.interface';
import { localizePrice } from '../../helpers';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  changeActiveQuoteNo,
  changeTotalPrice,
  changePaymentsOfTask,
} from '../../store/slices/mainSlice';
import XMBranch from './XMBranch';
import { useParams } from 'react-router';

const emptyPayment: Payment = {
  price: '',
  paid: false,
  paymentDate: '',
  quoteNo: '',
  proformaInvoiceNo: '',
};

function Payments() {
  const { taskId } = useParams<{ taskId?: string }>();
  const dispatch = useAppDispatch();

  const payments = useAppSelector<Payment[]>(({ main: { allTasks } }) =>
    taskId
      ? allTasks
          .find(({ id }) => id === taskId)
          ?.state.payments.map((p: Payment) => ({ ...p })) || []
      : []
  );

  const getTotalPrice = useCallback(
    () => payments.reduce((total, { price }) => total + Number(price), 0),
    [payments]
  );

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
      <div
        className="d-flex justify-content-between align-items-center"
        key={paymentPosition}
      >
        <Price
          value={payment.price}
          label={`Payment #${paymentPosition}`}
          handleChange={(value) => {
            dispatch(
              changePaymentsOfTask({
                taskId,
                payments: [...genericSetter('price', value, index)],
              })
            );
          }}
        />
        <Paid
          checked={payment.paid}
          onChange={({ target }) => {
            if (!target.checked) {
              payments[index].paymentDate = '';
            }
            dispatch(
              changePaymentsOfTask({
                taskId,
                payments: [...genericSetter('paid', target.checked, index)],
              })
            );
          }}
          paymentDate={payment.paymentDate}
          paymentDateChange={(date) => {
            dispatch(
              changePaymentsOfTask({
                taskId,
                payments: [
                  ...genericSetter(
                    'paymentDate',
                    dayjs(date).format('DDMMMYYYY'),
                    index
                  ),
                ],
              })
            );
          }}
        />
        <QuoteNo
          activeQuoteNo={payment.activeQuoteNo || false}
          handleActiveQuoteNoChange={() => {
            dispatch(changeActiveQuoteNo(payment.quoteNo));
            payments.forEach((p) => delete p.activeQuoteNo);
            dispatch(
              changePaymentsOfTask({
                taskId,
                payments: [...genericSetter('activeQuoteNo', true, index)],
              })
            );
          }}
          value={payment.quoteNo}
          label="Quote No."
          onChange={({ currentTarget }) => {
            dispatch(
              changePaymentsOfTask({
                taskId,
                payments: [
                  ...genericSetter(
                    'quoteNo',
                    (currentTarget as HTMLInputElement).value,
                    index
                  ),
                ],
              })
            );
          }}
        />
        <BaseInput
          className="ml-2"
          required={false}
          value={payment.proformaInvoiceNo}
          id={`proformaInvoiceNo${paymentPosition}`}
          label="Pro-forma invoice no."
          handleChange={({ currentTarget }) => {
            dispatch(
              changePaymentsOfTask({
                taskId,
                payments: [
                  ...genericSetter(
                    'proformaInvoiceNo',
                    (currentTarget as HTMLInputElement).value,
                    index
                  ),
                ],
              })
            );
          }}
        />

        <RemovePayment
          doIt={(e) => {
            const newPayments = [...payments];
            newPayments.splice(index, 1);
            dispatch(
              changePaymentsOfTask({
                taskId,
                payments: newPayments,
              })
            );
          }}
        />
      </div>
    );
  };

  return taskId ? (
    <div
      onBlur={(e) => {
        setTimeout(() => {
          dispatch(changeTotalPrice(getTotalPrice()));
          dispatch(
            changePaymentsOfTask({
              taskId,
              payments,
            })
          );
        });
      }}
    >
      <XMBranch />
      {payments.map(renderPayment)}
      <AddPayment
        doIt={(e) => {
          e.preventDefault();
          dispatch(
            changePaymentsOfTask({
              taskId,
              payments: [...payments, { ...emptyPayment }],
            })
          );
        }}
      />
      {renderTotal(getTotalPrice())}
    </div>
  ) : (
    <>Task has not been saved yet. To input payments info save task first.</>
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

export default Payments;
