import { Icon } from 'tabler-react';
import { useState, useEffect, useCallback } from 'react';
import dayjs from 'dayjs';
import { Price, Paid, QuoteNo, BaseInput } from './FormFields';
import type { Payment } from 'Task/Task.interface';
import { localizePrice } from 'helpers';
import DB from 'backend/DBManager';
import { useAppDispatch } from 'store/hooks';
import { changeActiveQuoteNo, changeTotalPrice } from 'store/slices/mainSlice';
import Select from 'react-select';
import { XMBranchOptions } from 'defaults';

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

function Payments({ taskId, ...props }: PaymentsProps) {
  const [payments, setPayments] = useState([] as Payment[]);
  const [branches, setBranches] = useState<typeof XMBranchOptions[number][]>(
    []
  );

  const dispatch = useAppDispatch();

  useEffect(() => {
    taskId && DB.get(taskId, 'branches', 'payments').then(setBranches);
  }, [taskId]);
  // gets payments from DB
  useEffect(() => {
    (async function () {
      if (taskId) {
        const { payments, branches } = await DB.get(
          taskId,
          ['data'],
          'payments'
        );
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
        setBranches(branches);
      }
    })();
  }, [taskId, props.payments, dispatch]);

  const getTotalPrice = useCallback(
    () => payments.reduce((total, { price }) => total + Number(price), 0),
    [payments]
  );

  useEffect(() => {
    dispatch(changeTotalPrice(getTotalPrice()));
  }, [payments, dispatch, getTotalPrice]);

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
            const newPayments = [...genericSetter('price', value, index)];
            setPayments(newPayments);
            taskId &&
              DB.updateInstance(taskId, { payments: newPayments }, 'payments');
          }}
        />
        <Paid
          checked={payment.paid}
          onChange={({ target }) => {
            if (!target.checked) {
              payments[index].paymentDate = '';
            }
            const newPayments = [
              ...genericSetter('paid', target.checked, index),
            ];
            setPayments(newPayments);
            taskId &&
              DB.updateInstance(taskId, { payments: newPayments }, 'payments');
          }}
          paymentDate={payment.paymentDate}
          paymentDateChange={(date) => {
            const newPayments = [
              ...genericSetter(
                'paymentDate',
                dayjs(date).format('DDMMMYYYY'),
                index
              ),
            ];
            setPayments(newPayments);
            taskId &&
              DB.updateInstance(taskId, { payments: newPayments }, 'payments');
          }}
        />
        <QuoteNo
          activeQuoteNo={payment.activeQuoteNo || false}
          handleActiveQuoteNoChange={() => {
            dispatch(changeActiveQuoteNo(payment.quoteNo));
            payments.forEach((p) => delete p.activeQuoteNo);
            const newPayments = [
              ...genericSetter('activeQuoteNo', true, index),
            ];
            setPayments(newPayments);
            taskId &&
              DB.updateInstance(taskId, { payments: newPayments }, 'payments');
          }}
          value={payment.quoteNo}
          label="Quote No."
          onChange={({ currentTarget }) => {
            const newPayments = [
              ...genericSetter(
                'quoteNo',
                (currentTarget as HTMLInputElement).value,
                index
              ),
            ];
            setPayments(newPayments);
            taskId &&
              DB.updateInstance(taskId, { payments: newPayments }, 'payments');
          }}
        />
        <BaseInput
          className="ml-2"
          required={false}
          value={payment.proformaInvoiceNo}
          id={`proformaInvoiceNo${paymentPosition}`}
          label="Pro-forma invoice no."
          handleChange={({ currentTarget }) => {
            const newPayments = [
              ...genericSetter(
                'proformaInvoiceNo',
                (currentTarget as HTMLInputElement).value,
                index
              ),
            ];
            setPayments(newPayments);
            taskId &&
              DB.updateInstance(taskId, { payments: newPayments }, 'payments');
          }}
        />

        <RemovePayment
          doIt={(e) => {
            e.preventDefault();
            const newPayments = [...payments];
            newPayments.splice(index, 1);
            setPayments(newPayments);
            taskId &&
              DB.updateInstance(taskId, { payments: newPayments }, 'payments');
          }}
        />
      </div>
    );
  };

  return (
    <>
      <div className="mb-3">
        XM Branch:
        <Select
          options={XMBranchOptions.map((option) => ({
            value: option,
            label: option,
          }))}
          isMulti
          value={branches.map((b) => ({ value: b, label: b }))}
          onBlur={() => {
            taskId &&
              DB.updateInstance(
                taskId,
                {
                  branches,
                },
                'payments'
              );
          }}
          onChange={(chosenOptions) =>
            setBranches(chosenOptions.map(({ value }) => value))
          }
        />
      </div>
      {payments.map(renderPayment)}
      <AddPayment
        doIt={(e) => {
          e.preventDefault();
          setPayments((payments) => [...payments, { ...emptyPayment }]);
        }}
      />
      {renderTotal(getTotalPrice())}
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

export default Payments;
