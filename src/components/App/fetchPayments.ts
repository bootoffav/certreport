import { Payment } from 'Task/Task.interface';
import { createClient } from '@supabase/supabase-js';

type PaymentDBType = {
  data: {
    id: number;
    branches: string[];
    payments: any[];
  };
};

// @ts-ignore
const fetchPayments = async (): Promise<Record<number, Payment[]>> => {
  const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  const { data, error } = await supabase.from('payments').select(`data`);

  return data !== null
    ? (data as PaymentDBType[]).reduce((acc, { data: { payments, id } }) => {
        // @ts-ignore
        acc[id] = payments;
        return acc;
      }, {})
    : [];
};

export default fetchPayments;
