const tableLayout = {
  basic: {
    hLineWidth: (i: any, node: any) => (i === 0 || i === node.table.body.length) ? 2 : 1,
    vLineWidth: (i: any, node: any) => (i === 0 || i === node.table.widths.length) ? 2 : 1,
    // hLineColor: (i: any, node: any) => (i === 0 || i === node.table.body.length) ? 'black' : 'gray',
    // vLineColor: (i: any, node: any) => (i === 0 || i === node.table.widths.length) ? 'black' : 'gray'
    }
};


export { tableLayout };