import CheckBox from './Checkbox';

const Footer = ({ dispatch, state }: any) => {
  const rows = [
    ['EUR', 'USD', 'RMB'],
    ['NO', 'Required'],
  ] as const;

  return (
    <table id="footer" className="table table-sm table-borderless">
      <tbody>
        <tr>
          <td>PI/OFFER in:</td>
          <td>
            {rows[0].map((item) => (
              <CheckBox
                key={item}
                area="footer"
                row={0}
                label={item}
                dispatch={dispatch}
                checked={state[0].includes(item)}
              >
                /&nbsp;&nbsp;&nbsp;
              </CheckBox>
            ))}
          </td>
        </tr>

        <tr>
          <td>Test Certificate:</td>
          <td>
            {rows[1].map((item) => (
              <CheckBox
                key={item}
                area="footer"
                row={1}
                label={item}
                dispatch={dispatch}
                checked={state[1].includes(item)}
              >
                /
              </CheckBox>
            ))}
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Footer;
