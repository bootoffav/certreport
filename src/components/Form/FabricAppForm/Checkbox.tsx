import { useContext } from 'react';
import { DispatchContext } from './FabricApplicationForm';

type CheckboxProps = {
  label: string;
  area: 'footer' | 'testRequirement' | 'washPreTreatment';
  row: number;
  checked?: boolean;
  children?: any;
};

const CheckBox = (props: CheckboxProps) => {
  const dispatch = useContext(DispatchContext);
  const area = props.area || 'testRequirement';
  const row = props.row ? props.row + '_' : '';
  const labelConverted = `${area}_${row}${props.label.replace(/ /g, '-')}`;

  return (
    <div className="form-check form-check-inline">
      <input
        type="checkbox"
        className="form-check-input"
        checked={props.checked}
        // id={labelConverted}
        // name={labelConverted}
        // @ts-ignore
        onChange={({ currentTarget: { checked } }) => {
          dispatch({
            type: props.area,
            payload: {
              checked,
              label: props.label,
              row: props.row,
            },
          });
        }}
      />
      <label className="form-check-label" htmlFor={labelConverted}>
        {props.label}
      </label>
    </div>
  );
};

export default CheckBox;
