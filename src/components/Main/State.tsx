import Loader from 'react-loader-spinner';

const State = ({ updated }: { updated: boolean }) =>
  updated ? (
    <></>
  ) : (
    <div className="mt-4 mx-3">
      <Loader type="Oval" color="#830e0e" height={33} width={33} />
    </div>
  );

export { State };
