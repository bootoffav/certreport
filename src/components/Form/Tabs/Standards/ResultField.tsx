import { useState, useEffect } from 'react';
import { DB } from '../../../../backend/DBManager';

interface ResultFieldProps {
  standard: 'EN 469' | 'EN 20471';
  param: string;
  taskId: string;
}

function ResultField({ taskId, param, standard }: ResultFieldProps) {
  const propertyToGet = `${standard}Result`;
  useEffect(() => {
    DB.genericGet(taskId, [propertyToGet, param]).then((result) => {
      if (typeof result === 'number') setValue(result);
    });
  }, [propertyToGet, param, taskId]);

  const [value, setValue] = useState<number>();

  return (
    <input
      style={{ width: '60%' }}
      className="mx-auto form-control form-control-sm mt-2"
      type="number"
      aria-label="Result field for standard test param"
      value={value || ''}
      onBlur={({ currentTarget: { value } }) =>
        DB.updateInstance(taskId, {
          [propertyToGet]: {
            [param]: Number(value),
          },
        })
      }
      onChange={({ currentTarget }) => setValue(Number(currentTarget.value))}
    />
  );
}

export { ResultField };
