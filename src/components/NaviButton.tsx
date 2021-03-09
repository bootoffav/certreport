import { useHistory } from 'react-router-dom';
import { Button } from 'tabler-react';

const GoBackOrHomeButton = () => {
  const history = useHistory();
  const label = history.length === 2 ? 'Main Page' : 'Back';
  return (
    <Button
      onClick={(e: any) => {
        e.preventDefault();
        history.length === 2 ? history.push('/') : history.goBack();
      }}
      color="azure"
      icon={label === 'Back' ? 'fe fe-arrow-left' : ''}
    >
      {label}
    </Button>
  );
};

export { GoBackOrHomeButton };
