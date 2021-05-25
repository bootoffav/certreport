import { tableLayout, fonts } from './settings';
import type { TaskState } from '../../../Task/Task.interface';

function makeDocDefinition({
  serialNumber,
  article,
  activeQuoteNo,
  ...state
}: TaskState) {
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

function getShippingLabelFile(state: TaskState) {
  return createShippingLabelFile(state).then((pdf) => pdf.download(pdf.name));
}

function createShippingLabelFile(state: TaskState) {
  const offerNo = state.activeQuoteNo
    ? state[state.activeQuoteNo]
    : 'not specified';

  return Promise.all([
    import('pdfmake/build/pdfmake'),
    import('./vfs_fonts.js'),
  ])
    .then(([pdfmake, vfs]: any) =>
      pdfmake.createPdf(makeDocDefinition(state), tableLayout, fonts, vfs.vfs)
    )
    .then((pdf) => {
      pdf.name = `Shipping label_${state.serialNumber}_${state.article}_${offerNo}.pdf`;
      return pdf;
    });
}

export { getShippingLabelFile, createShippingLabelFile };
