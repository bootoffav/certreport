import { getRandomColors } from './BrandChart';
test('test random colors', () => {
  let colors = getRandomColors(35);
  expect(colors.length).toBe(35);
  colors = getRandomColors(7);
  expect(colors.length).toBe(7);
});
