import Select from 'react-select';
import { XMBranchOptions } from '../../defaults';
import { useState, useEffect } from 'react';
import DB from '../../backend/DBManager';
import { useParams } from 'react-router';

function XMBranch() {
  const [branches, setBranches] = useState<typeof XMBranchOptions[number][]>(
    []
  );

  const { taskId } = useParams<{ taskId: string }>();

  useEffect(() => {
    taskId &&
      DB.get(taskId, 'payments', 'branches').then(({ branches }) => {
        setBranches(branches ?? []);
      });
  }, [taskId]);

  return (
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
          taskId && DB.updateInstance(taskId, branches, 'payments', 'branches');
        }}
        onChange={(chosenOptions) =>
          setBranches(chosenOptions.map(({ value }) => value))
        }
      />
    </div>
  );
}

export default XMBranch;
