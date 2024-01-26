import { formatArticle } from '../../../helpers';
import { tableLayout, fonts } from './settings';
import type { TaskState } from 'Task/Task.interface';

function makeDocDefinition({
  serialNumber,
  article,
  activeQuoteNo,
  ...state
}: TaskState) {
  const offerNo = activeQuoteNo ? activeQuoteNo.slice(3) : 'not specified';

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
        text: 'Carretera de Bañeres & Calle Societat Unió Musical\n03802-Alcoy (Alicante)\nESPAÑA',
        style: 'section',
      },
      {
        text: 'PPE DEPARTMENT\nAtt. Mauro Terol',
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
        text: `OFFER NO.: ${offerNo}\n`,
        style: ['bold', 'offer'],
      },
      {
        text: '\n',
        fontSize: 36,
        font: 'Arial',
      },
      {
        text: [
          `Material Reference: ${formatArticle(article)}\n`,
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
      title: `Shipping label_${serialNumber}_${formatArticle(article)}.pdf`,
      author: 'XM Group',
    },
  };
}

function getShippingLabelFile(state: TaskState) {
  return createShippingLabelFile(state).then((pdf) => pdf.download(pdf.name));
}

function createShippingLabelFile(state: TaskState) {
  const offerNo = state.activeQuoteNo ?? 'not specified';

  return Promise.all([
    import('pdfmake/build/pdfmake'),
    import('./vfs_fonts.js'),
  ])
    .then(([pdfmake, vfs]: any) =>
      pdfmake.createPdf(makeDocDefinition(state), tableLayout, fonts, vfs.vfs)
    )
    .then((pdf) => {
      pdf.name = `Shipping label_${state.serialNumber}_${formatArticle(
        state.article
      )}_${offerNo}.pdf`;
      return pdf;
    });
}

export { getShippingLabelFile, createShippingLabelFile };
