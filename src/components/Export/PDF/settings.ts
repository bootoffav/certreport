const tableLayout = {
  basic: {
    hLineWidth: (i: any, node: any) => (i === 0 || i === node.table.body.length) ? 2 : 1,
    vLineWidth: (i: any, node: any) => (i === 0 || i === node.table.widths.length) ? 2 : 1,
    // paddingTop: (i: any, node: any) => 0,
    // paddingBottom: (i: any, node: any) => 0,
  }
};

const fonts = {
  TimesNewRoman: {
    normal: 'times-new-roman.ttf',
    bold: 'times-new-roman-bold.ttf',
    italics: 'times-new-roman-italic.ttf',
    bolditalics: 'times-new-roman-bolditalic.ttf'
  }
};
const tableStyle = {
  lineHeight: 0.8
}

export { tableLayout, fonts, tableStyle };