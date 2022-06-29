import Loader from 'react-loader-spinner';
import { useAppSelector } from 'store/hooks';

const State = () => {
  const updated = useAppSelector(({ main }) => main.updated);
  return updated ? (
    <></>
  ) : (
    <div className="mt-4 mx-3">
      <Loader type="Oval" color="#830e0e" height={33} width={33} />
    </div>
  );
};

export default State;
