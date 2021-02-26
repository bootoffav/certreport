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
    const stagesSelect = $('.stages-select');
    stagesSelect.off('hidden.bs.select');
    stagesSelect.on('hidden.bs.select', null, tasks, function (e: any) {
      filter($(this).val() as string[]);
      e.stopPropagation();
    });
  }, [tasks]);

  function filter(stages: string[] | string) {
    update({ stages });
  }

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

  const more = ['all', 'overdue'];

  const DropDownItem = (item: any) => {
    return {
      value: item,
      key: item,
      onClick: () => update({ stages: [item] })
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
          className="selectpicker stages-select"
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

{
  /* <Dropdown
          type="button"
          value="Stages"
          color="indigo"
          triggerContent={
            <>
              Stages<sup>*</sup>
            </>
          }
          itemsObject={stages.map(DropDownItem)}
        ></Dropdown> */
}
