import { Button, Icon, Form } from 'tabler-react';
import CheckBox from './Checkbox';

const TestRequirement = ({ dispatch, state }: any) => (
  <table id="testRequirement" className="table table-sm table-bordered">
    <thead className="text-center">
      <tr>
        <th colSpan={8}>
          <span className="align-middle">Test Requirement</span>
          <div className="float-right">
            <Button
              link
              onClick={(e: any) => {
                e.preventDefault();
                // new AppFormExport(props.appForm).save();
              }}
            >
              Get as PDF <Icon prefix="fe" name="download" />
            </Button>
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Standard No.</td>
        <td colSpan={7}>Optional Test Item Under Standard</td>
      </tr>
      <tr>
        {['EN 11611', 'A1', 'A2'].map((item) => (
          <td key={item}>
            <CheckBox
              label={item}
              area="testRequirement"
              dispatch={dispatch}
              row={0}
              checked={state[0].includes(item)}
            />
          </td>
        ))}
        <td colSpan={5}></td>
      </tr>
      <tr>
        {['EN 11612', 'A1', 'A2', 'B', 'C', 'D', 'E', 'F'].map((item) => (
          <td key={item}>
            <CheckBox
              label={item}
              area="testRequirement"
              dispatch={dispatch}
              row={1}
              checked={state[1].includes(item)}
            />
          </td>
        ))}
      </tr>
      <tr>
        {['EN 1149-5', 'EN 1149-1', 'EN 1149-3'].map((item) => (
          <td key={item}>
            <CheckBox
              label={item}
              area="testRequirement"
              dispatch={dispatch}
              row={2}
              checked={state[2].includes(item)}
            />
          </td>
        ))}
        <td colSpan={5}></td>
      </tr>
      <tr>
        {['EN 61482-1-2', 'Class 1', 'Class 2'].map((item) => (
          <td key={item}>
            <CheckBox
              label={item}
              area="testRequirement"
              dispatch={dispatch}
              row={3}
              checked={state[3].includes(item)}
            />
          </td>
        ))}
        <td colSpan={5}></td>
      </tr>
      <tr>
        <td>
          <CheckBox
            label={'EN 20471'}
            area="testRequirement"
            dispatch={dispatch}
            row={4}
            checked={state[4].includes('EN 20471')}
          />
        </td>
        <td colSpan={7}>According to Standard Mandotory Test Requirement</td>
      </tr>
      <tr>
        <td>
          <CheckBox
            label={'EN 14116'}
            area="testRequirement"
            dispatch={dispatch}
            row={5}
            checked={state[5].includes('EN 14116')}
          />
        </td>
        <td colSpan={7}>According to Standard Mandotory Test Requirement</td>
      </tr>
      <tr>
        <td>
          <CheckBox
            label={'EN 343'}
            area="testRequirement"
            dispatch={dispatch}
            row={6}
            checked={state[6].includes('EN 343')}
          />
        </td>
        <td colSpan={7}>According to Standard Mandotory Test Requirement</td>
      </tr>
      <tr>
        <td>
          <div className="form-check form-check-inline">
            <Form.Switch
              label="Other Standard 1"
              checked={state[7].includes('Other Standard 1')}
              type="checkbox"
              onChange={({
                currentTarget: { checked },
              }: React.SyntheticEvent<HTMLInputElement>) => {
                dispatch({
                  type: 'testRequirement',
                  payload: {
                    checked,
                    row: 7,
                    label: 'Other Standard 1',
                  },
                });
              }}
            />
          </div>
        </td>
        <td colSpan={7}>
          <input
            className="form-control form-control-sm input-xs"
            value={state.otherStandard1}
            onChange={({ currentTarget: { value } }) => {
              dispatch({
                type: 'otherStandard1',
                payload: { value },
              });
            }}
            disabled={!state[7].includes('Other Standard 1')}
          />
        </td>
      </tr>
      <tr>
        <td>
          <div className="form-check form-check-inline">
            <Form.Switch
              label="Other Standard 2"
              checked={state[8].includes('Other Standard 2')}
              type="checkbox"
              onChange={({
                currentTarget: { checked },
              }: React.SyntheticEvent<HTMLInputElement>) => {
                dispatch({
                  type: 'testRequirement',
                  payload: {
                    checked,
                    row: 8,
                    label: 'Other Standard 2',
                  },
                });
              }}
            />
          </div>
        </td>
        <td colSpan={7}>
          <input
            className="form-control form-control-sm input-xs"
            id="testRequirement_Other-Standard-2-description"
            value={state.otherStandard2}
            onChange={({ currentTarget: { value } }) => {
              dispatch({
                type: 'otherStandard2',
                payload: { value },
              });
            }}
            disabled={!state[8].includes('Other Standard 2')}
          />
        </td>
      </tr>
    </tbody>
  </table>
);

export default TestRequirement;
