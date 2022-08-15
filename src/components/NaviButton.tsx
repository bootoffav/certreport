import { useNavigate } from 'react-router-dom';
import { Button } from 'tabler-react';

const GoBackOrHomeButton = () => {
  const navigate = useNavigate();
  const label = navigate.length === 2 ? 'Main Page' : 'Back';
  return (
    <Button
      onClick={(e: React.SyntheticEvent) => {
        e.preventDefault();
        navigate.length === 2 ? navigate('/') : navigate(-1);
      }}
      color="azure"
      icon={label === 'Back' ? 'fe fe-arrow-left' : ''}
    >
      {label}
    </Button>
  );
};

export { GoBackOrHomeButton };
