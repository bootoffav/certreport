import { formatArticle } from './AppFormExport';

it('formats Article name', () => {
  expect(
    formatArticle(
      'OXFORD-160 (Oxford-160, 100% poly, 160gsm, PU600, Green #21-08)'
    )
  ).toBe('OXFORD-160');

  expect(formatArticle('OXFORD-160')).toBe('OXFORD-160');
});
