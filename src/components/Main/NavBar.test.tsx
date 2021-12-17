import { screen, render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import NavBar from './NavBar';

test('sees Expiring certificates', () => {
  render(<Router children={<NavBar update={() => {}} updated={true} />} />);
  expect(screen.getByText('Expiring Certificates')).toBeInTheDocument();
});
