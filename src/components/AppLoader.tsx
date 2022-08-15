import Loader from 'react-loader-spinner';

function AppLoader() {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh' }}
    >
      <Loader type="Oval" color="#467fcf" height={300} width={300} />
    </div>
  );
}

export default AppLoader;
