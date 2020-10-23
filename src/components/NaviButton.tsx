import { useHistory } from 'react-router-dom';
import { Button } from 'tabler-react';

const GoBackOrHomeButton = () => {
  const history = useHistory();
  const label = history.length > 1 ? 'Back' : 'Main Page';

  return (
    <Button
      onClick={(e: any) => {
        e.preventDefault();
        history.length > 1 ? history.goBack() : history.push('/');
      }}
      color="azure"
      icon={label === 'Back' ? 'fe fe-arrow-left' : ''}
    >
      {label}
    </Button>
  );
};

export { GoBackOrHomeButton };
