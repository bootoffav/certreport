import { Icon } from 'tabler-react';
import { localizePrice } from '../../../../helpers';
import { useState } from 'react';
import DB from '../../../../backend/DBManager';

interface PriceChangerProps {
  cost: string;
  refInDb: string;
  updater: (cost: any) => void;
}

function CostChanger(props: PriceChangerProps) {
  const [isChanging, setIsChanging] = useState(false);
  const [cost, setCost] = useState(props.cost);

  const change = () => {
    return (
      <div className="input-group input-group-sm">
        <input
          type="text"
          className="form-control"
          value={cost}
          onChange={({ currentTarget }: React.SyntheticEvent) =>
            setCost((currentTarget as HTMLInputElement).value)
          }
        />
        <div className="input-group-append">
          <button
            className="btn btn-small btn-outline-success"
            type="button"
            onClick={() => {
              setIsChanging(false);
              DB.updateInstance(props.refInDb, { cost }, 'standards');
              props.updater(cost);
            }}
          >
            <Icon prefix="fe" width="60" name="check-square" />
          </button>
        </div>
      </div>
    );
  };

  const show = () => {
    return (
      <>
        {localizePrice(Number(cost))}{' '}
        <span className="float-right" style={{ color: 'lightgray' }}>
          <Icon
            prefix="fe"
            width="60"
            name="settings"
            onClick={() => setIsChanging(true)}
          />
        </span>
      </>
    );
  };
  return isChanging ? change() : show();
}

export { CostChanger };
