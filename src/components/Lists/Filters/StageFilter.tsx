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
      filter($(this).val() as string[], e.data);
      e.stopPropagation();
    });
  }, [tasks]);

  function filter(stages: string[] | string, tasks: any) {
    let visibleData;
    let stage;
    switch (stages[0]) {
      case 'all':
        visibleData = tasks;
        break;
      case 'overdue':
        visibleData = tasks.filter((t: Task) => t.overdue);
        break;
      default:
        visibleData = tasks.filter((t: Task) => stages.includes(t.state.stage));
        stage = stages.length === 1 ? stages[0] : 'all';
    }

    update({
      visibleData,
      stage: stage || stages[0],
      totalPrice: countTotalPrice(visibleData),
      startDate: undefined,
      endDate: undefined,
    });
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
      onClick: () => filter([item], tasks),
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
