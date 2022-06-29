import Loader from 'react-loader-spinner';
import { useSelector } from 'react-redux';
import { RootState } from 'store';

const State = () => {
  const updated = useSelector(({ main }: RootState) => main.updated);
  return updated ? (
    <></>
  ) : (
    <div className="mt-4 mx-3">
      <Loader type="Oval" color="#830e0e" height={33} width={33} />
    </div>
  );
};

export default State;
