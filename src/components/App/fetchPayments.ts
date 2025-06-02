import { Payment } from 'Task/Task.interface';

type PaymentDBType = {
  id: number;
  branches: string[];
  payments: any[];
};

const fetchPayments = async () => {
  return await fetch(`https://${window.location.hostname}:3100/payments`, {})
    .then((r) => r.json())
    .then((data: PaymentDBType[]) => {
      return (data as PaymentDBType[]).reduce((acc, { payments, id }) => {
        // @ts-ignore
        acc[id] = payments;
        return acc;
      }, {});
    })
    .catch((e) => {
      return [];
    });
};

export default fetchPayments;
