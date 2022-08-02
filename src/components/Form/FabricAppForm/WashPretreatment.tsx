import CheckBox from './Checkbox';
import { useContext } from 'react';
import { DispatchContext } from './FabricApplicationForm';

const WashPreTreatment = ({ state }: any) => {
  const dispatch = useContext(DispatchContext);
  return (
    <table id="washPreTreatment" className="table table-sm table-bordered">
      <thead className="text-center">
        <tr>
          <th colSpan={9}>
            Wash Pre-treatment Requirement - Please mark down below for your
            wash requirement
          </th>
        </tr>
      </thead>
      <tbody>
        <tr className="text-center">
          <td>Wash Method</td>
          <td>Cycles</td>
          <td>Wash Temperature &#8451;</td>
          <td colSpan={6}>Dry Method</td>
        </tr>
        <tr>
          <td>Domestic Wash(ISO 6330)</td>
          <td>
            <input
              type="number"
              className="form-control form-control-sm input-xs"
              id="washPreTreatment_0_cycles"
              value={state.cycles[0]}
              onChange={({ currentTarget: { value } }) => {
                dispatch({
                  type: 'cycles',
                  payload: { value, position: 0 },
                });
              }}
            />
          </td>
          <td>
            <input
              type="number"
              className="form-control form-control-sm input-xs"
              id="washPreTreatment_0_temperature"
              value={state.washTemp}
              onChange={({ currentTarget: { value } }) => {
                dispatch({
                  type: 'washTemp',
                  payload: { value },
                });
              }}
            />
          </td>

          {['A', 'B', 'C', 'D', 'E', 'F'].map((item) => (
            <td key={item}>
              <CheckBox
                label={item}
                row={0}
                area="washPreTreatment"
                checked={state[0].includes(item)}
              />
            </td>
          ))}
        </tr>
        <tr>
          <td>Industrial Wash(ISO 15797)</td>
          <td>
            <input
              type="number"
              className="form-control form-control-sm input-xs"
              id="washPreTreatment_1_cycles"
              value={state.cycles[1]}
              onChange={({ currentTarget: { value } }) => {
                dispatch({
                  type: 'cycles',
                  payload: { value, position: 1 },
                });
              }}
            />
          </td>
          <td>According to standard</td>
          {['Tumble Dry', 'Tunnel Dry'].map((item) => (
            <td colSpan={3} key={item}>
              <CheckBox
                label={item}
                row={1}
                area={'washPreTreatment'}
                checked={state[1].includes(item)}
              />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
};

export default WashPreTreatment;
