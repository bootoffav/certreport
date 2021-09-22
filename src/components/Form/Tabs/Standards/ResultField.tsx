import { useState, useEffect } from 'react';
import { DB } from '../../../../backend/DBManager';

interface ResultFieldProps {
  standardName: 'EN 469' | 'EN 20471';
  param: string;
  taskId: string;
}

function ResultField(props: ResultFieldProps) {
  const propertyToGet = `${props.standardName.replace(/\s/g, '')}Result`;
  // TODO: reduce amount of DB requests
  useEffect(() => {
    DB.genericGet(props.taskId, [
      propertyToGet,
      props.param,
    ]).then((result: { [key: string]: any }) => setValue(result[props.param]));
  }, [propertyToGet, props.param, props.taskId]);

  const [value, setValue] = useState<number>();
  return (
    <input
      style={{ width: '60%' }}
      className="mx-auto form-control form-control-sm mt-2"
      type="number"
      aria-label="Result field for standard test param"
      value={value}
      onBlur={({ currentTarget }) =>
        DB.updateInstance(props.taskId, {
          [propertyToGet]: {
            [props.param]: Number(currentTarget.value),
          },
        })
      }
      onChange={({ currentTarget }) => setValue(Number(currentTarget.value))}
    />
  );
}

export { ResultField };
