import { tableLayout, fonts } from './settings';
import type { IState } from '../../../Task/emptyState';

function makeDocDefinition({
  serialNumber,
  article,
  activeQuoteNo,
  ...state
}: IState) {
  const offerNo = activeQuoteNo
    ? state[activeQuoteNo].slice(3)
    : 'not specified';

  return {
    pageOrientation: 'landscape',
    content: [
      {
        text: 'AITEX',
        style: {
          fontSize: 65,
          bold: true,
          font: 'Arial',
          alignment: 'center',
        },
      },
      {
        text: 'Plaza Emilio Sala, nº1\n03801-Alcoy (Alicante)\nESPAÑA',
        style: 'section',
      },
      {
        text: 'PPE DEPARTMENT\nAtt. LUCIA BENAVENT',
        style: ['section', 'bold'],
      },
      {
        text: 'Tlf. +34 965.542.200',
        style: {
          fontSize: 25,
          alignment: 'center',
          font: 'Arial',
        },
      },
      {
        text: `OFFER NO.: ${offerNo || 'not specified'}\n`,
        style: ['bold', 'offer'],
      },
      {
        text: '\n',
        fontSize: 36,
        font: 'Arial',
      },
      {
        text: [
          `Material Reference: ${article}\n`,
          `Customer order: ${serialNumber}`,
        ],
        style: {
          color: 'red',
          fontSize: 20,
          font: 'Arial',
        },
      },
    ],
    styles: {
      section: {
        fontSize: 30,
        alignment: 'center',
        font: 'Arial',
      },
      bold: {
        bold: true,
      },
      offer: {
        fontSize: 28,
        alignment: 'center',
        font: 'Arial',
      },
    },
    pageMargins: [50, 50],
    info: {
      title: `Shipping label_${serialNumber}_${article}.pdf`,
      author: 'XM Group',
    },
  };
}

function getShippingLabelFile(state: IState) {
  return create(state).then((pdf) =>
    pdf.download(`Shipping label_${state.serialNumber}_${state.article}.pdf`)
  );
}

function create(state: IState) {
  return Promise.all([
    import('pdfmake/build/pdfmake'),
    import('./vfs_fonts.js'),
  ]).then(([pdfmake, vfs]: any) =>
    pdfmake.createPdf(makeDocDefinition(state), tableLayout, fonts, vfs.vfs)
  );
}

export { getShippingLabelFile };
