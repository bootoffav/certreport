import { useDispatch, useSelector } from 'react-redux';
import { changeActiveBrands, RootState } from 'store';

const BrandFilter = ({ update }: any) => {
  const allBrands = ['XMT', 'XMS', 'XMF', 'No brand'];
  const activeBrands = useSelector(
    (state: RootState) => state.main.activeBrands
  );

  const dispatch = useDispatch();

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
      <div className="btn-group" data-toggle="buttons">
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
