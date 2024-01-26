import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  changeActiveStandards,
  IInitialState,
} from '../../store/slices/mainSlice';
import AdditionalStandardFilter from './AdditionalStandardFilter';

function StandardFilter() {
  const dispatch = useAppDispatch();
  const activeStandards = useAppSelector(({ main }) => main.activeStandards);

  return (
    <div className="d-flex flex-column">
      <div className="btn-group btn-group-sm" data-toggle="buttons">
        {(
          [
            'EN 11611',
            'EN 11612',
            'EN 469',
            'EN 20471',
            'EN 13034',
            'EN 61482-1-2',
            'all',
          ] as const
        ).map((standard) => (
          <label
            className={`btn btn-${standard === 'all' ? 'info' : 'secondary'}`}
            key={standard}
          >
            <input
              type="checkbox"
              value={standard}
              checked={activeStandards.includes(standard)}
              onChange={({ target }) => {
                const { value: standard, checked } = target as unknown as {
                  value: IInitialState['activeStandards'][number];
                  checked: boolean;
                };
                dispatch(
                  changeActiveStandards({
                    standard,
                    checked,
                  })
                );
              }}
            />{' '}
            {standard.toUpperCase()}
          </label>
        ))}
      </div>
      {['EN 469', 'EN 20471'].includes(activeStandards[0]) ? (
        <AdditionalStandardFilter />
      ) : (
        ''
      )}
    </div>
  );
}

export default StandardFilter;
