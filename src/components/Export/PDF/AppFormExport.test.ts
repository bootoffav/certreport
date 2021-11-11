import { splitProductAndWeight } from './AppFormExport';

it('splits product and weight', () => {
  let product, weight: string;
  [product, weight] = splitProductAndWeight('100% poly, 160gsm');
  expect(product).toBe('100% poly');
  expect(weight).toBe('160gsm');

  [product, weight] = splitProductAndWeight(
    '93% Meta Aramid, 5% Para Aramid, 2% Antistatic, 260 gsm'
  );
  expect(product).toBe('93% Meta Aramid, 5% Para Aramid, 2% Antistatic');
  expect(weight).toBe('260 gsm');

  [product, weight] = splitProductAndWeight(
    '99% Cotton, 1% Antistatic, FR-Twill 2/2, 350 gsm'
  );
  expect(product).toBe('99% Cotton, 1% Antistatic, FR-Twill 2/2');
  expect(weight).toBe('350 gsm');
});
