import { selectOptions } from 'defaults';
import Select, { components } from 'react-select';
import { useEffect, useReducer } from 'react';
import DB from 'backend/DBManager';

function standardsForTitleReducer(state: any, { type, payload }: any) {
  switch (type) {
    case 'toggle':
      return {
        ...state,
        [payload]: !state[payload],
      };
    case 'update':
      const labels = payload.map((item: any) => item.label);
      return Object.fromEntries(labels.map((l: string) => [l, state[l]]));
    default:
      return { ...payload };
  }
}

const Option = ({ selectProps, label, ...props }: any) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={!!selectProps.standardsForTitle[label] && props.isSelected}
          onClick={(e) => e.stopPropagation()}
          onChange={() => {
            selectProps.dispatch({ type: 'toggle', payload: label });
          }}
        />{' '}
        <label>{label}</label>
      </components.Option>
    </div>
  );
};

type StandardSelectorProps = {
  chosenStandards: string;
  asSelectable: any;
  handleSelectChange: any;
  taskId: string;
};

function StandardSelector(props: StandardSelectorProps) {
  const [standardsForTitleState, dispatch] = useReducer(
    standardsForTitleReducer,
    {}
  );

  useEffect(() => {
    if (props.taskId) {
      DB.get(props.taskId, 'standardsForTitle', 'certification')
        .then((initState) => {
          dispatch({ payload: initState });
        })
        // backup in case no data in DB yet
        .catch(() => {
          dispatch({
            payload: Object.fromEntries(
              props.chosenStandards.split(', ').map((k) => [k, true])
            ),
          });
        });
    }
    // eslint-disable-next-line
  }, [props.taskId]);

  return (
    <Select
      isMulti
      hideSelectedOptions={false}
      closeMenuOnSelect={false}
      onBlur={() => {
        DB.updateInstance(
          props.taskId,
          { standardsForTitle: standardsForTitleState },
          'certification',
          'Replace'
        ).then((e) => console.log(e, 'done'));
      }}
      // @ts-ignore
      standardsForTitle={standardsForTitleState}
      dispatch={dispatch}
      value={props.asSelectable(props.chosenStandards)}
      onChange={(e) => {
        props.handleSelectChange(e, 'standards');
        dispatch({ type: 'update', payload: e });
      }}
      components={{ Option }}
      options={selectOptions.standards}
    />
  );
}

export default StandardSelector;
