import Loader from 'react-loader-spinner';
import { useAppSelector } from 'store/hooks';

const State = () => (
  <>
    {!useAppSelector(({ main }) => main.updated) && (
      <Loader
        className="mx-3 mt-2"
        type="Oval"
        color="#830e0e"
        height={33}
        width={33}
      />
    )}
  </>
);

export default State;
