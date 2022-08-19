import { useNavigate } from 'react-router-dom';
import { Button } from 'tabler-react';

export default function GoBackButton() {
  const navigate = useNavigate();
  const [label, path] =
    window.history.length === 2 ? ['Main page', '/'] : ['Back', -1];
  return (
    <Button
      onClick={(e: React.SyntheticEvent) => {
        e.preventDefault();
        // @ts-expect-error
        navigate(path);
      }}
      color="azure"
      icon={label === 'Back' ? 'fe fe-arrow-left' : ''}
    >
      {label}
    </Button>
  );
}
