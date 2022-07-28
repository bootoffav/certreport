import Select from 'react-select';
import { stages as stagesOptionsDefault } from 'defaults';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { changeStages } from 'store/slices/mainSlice';

type SelectItem = {
  value?: string;
  options?: any;
  label: string;
};

const StageFilter = () => {
  const dispatch = useAppDispatch();
  const stages = useAppSelector(({ main: { stages } }) => stages);
  const stagesOptions: any[] = [
    ...stagesOptionsDefault,
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

    dispatch(changeStages(stages));
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

export default StageFilter;
