import Select from 'react-select';

type SelectItem = {
  value?: string;
  options?: any;
  label: string;
};

const StageFilter: React.FunctionComponent<{
  update: any;
  tasks: any;
  stages: any;
}> = ({ tasks, update, stages }) => {
  const stagesOptions: any[] = [
    {
      label: 'Stages',
      options: [
        { value: '00. Paused', label: '00. Paused' },
        { value: '01. Canceled', label: '01. Canceled' },
        { value: '02. Estimate', label: '02. Estimate' },
        {
          value: '0. Sample to be prepared',
          label: '0. Sample to be prepared',
        },
        { value: '1. Sample Sent', label: '1. Sample Sent' },
        { value: '2. Sample Arrived', label: '2. Sample Arrived' },
        { value: '3. PI Issued', label: '3. PI Issued' },
        { value: '4. Payment Done', label: '4. Payment Done' },
        { value: '5. Testing is started', label: '5. Testing is started' },
        { value: '6. Pre-treatment done', label: '6. Pre-treatment done' },
        { value: '7. Test-report ready', label: '7. Test-report ready' },
        { value: '8. Certificate ready', label: '8. Certificate ready' },
        { value: '9. Ended', label: '9. Ended' },
        {
          value: '10. Repeat Testing is started',
          label: '10. Repeat Testing is started',
        },
        {
          value: '11. Repeat Test-report ready',
          label: '11. Repeat Test-report ready',
        },
      ],
    },
    {
      label: 'More',
      options: [
        { value: 'all', label: 'All' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'ongoing', label: 'Ongoing' },
      ],
    },
  ];

  const onChange = (selectedOptions: SelectItem[], action: any) => {
    let stages = selectedOptions.map((option: SelectItem) => option.value);

    if (action.action === 'select-option') {
      stages =
        action.option.value === 'all'
          ? ['all']
          : stages.filter((s) => s !== 'all');
    }

    update({ stages });
  };

  const getCurrentSelectValues = () => {
    return stages.map((stage: string) => {
      return {
        value: stage,
        label: stage.slice(0, 1).toUpperCase() + stage.slice(1),
      };
    });
  };

  return (
    <div style={{ minWidth: '200px', display: 'inline-block' }}>
      <Select
        classNamePrefix="stageFilter"
        isMulti
        options={stagesOptions}
        value={getCurrentSelectValues()}
        // @ts-expect-error
        onChange={onChange}
      />
    </div>
  );
};

export { StageFilter };
