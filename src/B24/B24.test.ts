import { formTaskFields } from './B24';

const baseState = {
  accomplices: [],
  article: 'OXFORD-160',
};

it('test form fields PARENT_ID proper value', async () => {
  const XMS = await formTaskFields({
    ...baseState,
    brand: 'XMS',
  });
  expect(XMS.PARENT_ID).toBe(97256);

  const XMF = await formTaskFields({
    ...baseState,
    brand: 'XMF',
  });
  expect(XMF.PARENT_ID).toBe(46902);

  const anyBrand = await formTaskFields({
    ...baseState,
    brand: 'XMF',
  });
  expect(anyBrand.PARENT_ID).toBe(46902);
});
