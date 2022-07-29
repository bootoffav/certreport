type CheckboxProps = {
  label: string;
  area: 'footer' | 'testRequirement' | 'washPretreatment';
  row: number;
  checked?: boolean;
  dispatch?: any;
  // onChange?: (table: string, row: number, label: string) => void;
  // onChange: any;
  children?: any;
};

const CheckBox = (props: CheckboxProps) => {
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
          // debugger;
          props.dispatch({
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
