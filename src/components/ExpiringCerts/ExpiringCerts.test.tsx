import { screen, render, within } from '@testing-library/react';
import ExpiringCerts from './ExpiringCerts';

xit('show availability announcement', () => {
  // render(<ExpiringCerts />);
  expect(screen.getByText('TO BE IMPLEMENTED SOON')).toBeInTheDocument();
});
