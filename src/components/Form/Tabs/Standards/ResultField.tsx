import { useState, useEffect } from 'react';
import { Icon } from 'tabler-react';
import { DB } from 'backend/DBManager';

interface ResultFieldProps {
  standard: 'EN 469' | 'EN 20471';
  param: string;
  taskId: string;
}

function ResultField({ taskId, param, standard }: ResultFieldProps) {
  const documentKey = `${standard.replace(/\s/, '')}Result`; //

  const [value, setValue] = useState<string>('');
  const [iconState, setIconState] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      const response = await DB.genericGet(taskId, [documentKey, param]);
      if (typeof response === 'string') {
        setValue(response);
      }
    })();
  }, [taskId, param, documentKey]);

  return (
    <div className="mx-auto mt-2 input-group" style={{ width: '80%' }}>
      <input
        className="form-control form-control-sm"
        type="number"
        aria-label="Result field for standard test param"
        value={value}
        onBlur={({ currentTarget: { value } }) => {
          DB.updateInstance(taskId, {
            [documentKey]: {
              [param]: value,
            },
          }).then(() => setIconState(true));
        }}
        onChange={({ currentTarget }) => {
          setIconState(false);
          setValue(currentTarget.value);
        }}
      />
      <Icon
        prefix="fe"
        width="60"
        className={`input-group-text ${iconState ? 'greenIcon' : 'redIcon'}`}
        name={iconState ? 'check-square' : 'slash'}
      />
    </div>
  );
}

export { ResultField };
