import { useEffect, useState, useRef } from 'react';
import 'bootstrap-select';
import $ from 'jquery';
import { Task } from '../../../Task/Task';
import { Dropdown } from 'tabler-react';
import { countTotalPrice } from '../../../helpers';

import 'bootstrap-select/dist/css/bootstrap-select.min.css';

const StageFilter: React.FunctionComponent<{
  update: any;
  tasks: any;
}> = ({ tasks, update }) => {
  useEffect(() => {
    $('.selectpicker').selectpicker('selectAll');
  }, []);

  useEffect(() => {
    const selectpicker = $('.selectpicker');
    selectpicker.off('hidden.bs.select');
    selectpicker.on('hidden.bs.select', () =>
      update({ stages: selectpicker.val() })
    );
  }, [tasks]);

  const stages = [
    '00. Paused',
    '01. Canceled',
    '02. Estimate',
    '0. Sample to be prepared',
    '1. Sample Sent',
    '2. Sample Arrived',
    '3. PI Issued',
    '4. Payment Done',
    '5. Testing is started',
    '6. Pre-treatment done',
    '7. Test-report ready',
    '8. Certificate ready',
    '9. Ended',
  ];

  const more = ['all', 'overdue', 'ongoing'];

  const DropDownItem = (stage: any) => {
    return {
      value: stage.slice(0, 1).toUpperCase() + stage.slice(1),
      key: stage,
      onClick: () => update({ stages: [stage] }),
    };
  };

  return (
    <div
      id="toolbar"
      style={{ width: 'inherit' }}
      className="btn-group"
      role="group"
    >
      <div className="mr-2">
        <select
          data-actions-box="true"
          className="selectpicker"
          data-style="btn-indigo"
          data-selected-text-format="count"
          title="Stages"
          multiple
        >
          {stages.map((stage: string) => (
            <option key={stage}>{stage}</option>
          ))}
        </select>
      </div>
      <Dropdown
        type="button"
        value="More"
        color="cyan"
        triggerContent="More"
        itemsObject={more.map(DropDownItem)}
      ></Dropdown>
    </div>
  );
};

export default StageFilter;
