import { useAppDispatch, useAppSelector } from 'store/hooks';
import { changeActiveBrands, IInitialState } from 'store/slices/mainSlice';

const BrandFilter = ({ update }: any) => {
  const allBrands: IInitialState['activeBrands'] = [
    'XMT',
    'XMS',
    'XMF',
    'No brand',
  ];
  const activeBrands = useAppSelector(({ main }) => main.activeBrands);

  const dispatch = useAppDispatch();

  const getActiveBrands = () =>
    allBrands.filter((brand) => activeBrands.includes(brand));

  const handleChange = ({
    currentTarget: { value, checked },
  }: React.BaseSyntheticEvent) => {
    const ab = checked
      ? [...getActiveBrands(), value]
      : getActiveBrands().filter((brand) => brand !== value);
    dispatch(changeActiveBrands(ab));
  };

  return (
    <div className="d-flex align-items-start">
      <div className="btn-group btn-group-sm" data-toggle="buttons">
        {allBrands.map((brand) => (
          <label className="btn btn-secondary" key={brand}>
            <input
              type="checkbox"
              value={brand}
              checked={activeBrands.includes(brand)}
              onChange={handleChange}
            />{' '}
            {brand}
          </label>
        ))}
      </div>
    </div>
  );
};

export { BrandFilter };
