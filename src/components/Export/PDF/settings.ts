const tableLayout = {
  basic: {
    hLineWidth: (i: any, node: any) =>
      i === 0 || i === node.table.body.length ? 2 : 1,
    vLineWidth: (i: any, node: any) =>
      i === 0 || i === node.table.widths.length ? 2 : 1,
  },
};

const fonts = {
  Arial: {
    normal: 'arial.ttf',
    bold: 'arialbd.ttf',
    italics: 'arial-corsivo-2.ttf',
  },
  Icons: {
    normal: 'fontello.ttf',
  },
};

export { tableLayout, fonts };
