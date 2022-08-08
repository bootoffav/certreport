import type { TaskState } from './Task/Task.interface';

/**
 * Converts strings that represent dates in the app.
 * @param {string} oldFormat like '05Mar2019' or ''
 * @param {string} format like 'DD.MM.YYYY'
 * @returns {string} simplification of the ISO 8601 => '2019-03-05'
 */
function dateConverter(
  oldFormat: string,
  format: string | undefined = undefined
): string {
  if (oldFormat === '') {
    return oldFormat;
  }

  // check if oldFormat is ISO8601-compat, skip conversion
  if (oldFormat.charAt(4) === '-' && oldFormat.charAt(7) === '-') {
    return oldFormat;
  }

  const months: {
    [k: string]: string;
  } = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12',
  };
  switch (format) {
    case 'DD.MM.YYYY':
      return `${oldFormat.slice(0, 2)}.${
        months[oldFormat.slice(2, 5)]
      }.${oldFormat.slice(5)}`;
    case undefined:
      return `${oldFormat.slice(5)}-${
        months[oldFormat.slice(2, 5)]
      }-${oldFormat.slice(0, 2)}`;
    default:
      return '';
  }
}

function removeEmptyProps(obj: any) {
  Object.keys(obj).forEach((key) => obj[key] === '' && delete obj[key]);

  return obj;
}

function countTotalPrice(tasks: any[]): number {
  return Math.round(
    tasks.reduce((acc, task) => acc + getTaskTotalPriceHelper(task.state), 0)
  );
}

function getTaskTotalPriceHelper({ payments }: TaskState): number {
  return payments.reduce((acc, { price }) => acc + +price, 0);
}

const StageShortNames: {
  [key: string]: string;
} = {
  '00. Paused': '00.P',
  '01. Canceled': '01.C',
  '02. Estimate': '02.E',
  '0. Sample to be prepared': '0.STP',
  '1. Sample Sent': '1.SS',
  '2. Sample Arrived': '2.SA',
  '3. PI Issued': '3.PI',
  '4. Payment Done': '4.PD',
  '5. Testing is started': '5.TS',
  '6. Pre-treatment done': '6.PTD',
  '7. Test-report ready': '7.TR',
  '8. Certificate ready': '8.CR',
  '9. Ended': '9.End',
  '10. Repeat Sample to be prepared': '10.R_STP',
  '11. Repeat Sample Sent': '11.R_SS',
  '12. Repeat Sample Arrived': '12.R_SA',
  '13 Repeat PI issued': '13.R_PI',
  '14. Repeat Payment done': '14.R_PD',
  '15. Repeat Testing is started': '15.R_TS',
  '16. Repeat Pre-Treatment done': '16.R_PTD',
  '17. Repeat Test-report ready': '17.R_TR',
  '18. Repeat Certificate ready': '18.R_CR',
};

function printStage(stage: string, place: 'table' | 'select' | 'dropdown') {
  switch (place) {
    case 'table':
      return StageShortNames[stage];
    case 'select':
      return stage.substring(stage.indexOf(' ') + 1);
    case 'dropdown':
      return `${StageShortNames[stage]} - ${stage.substring(
        stage.indexOf(' ') + 1
      )}`;
  }
}

function shortenTitle(title: string) {
  const index = title.indexOf(' ');
  return index === -1 ? title : title.substring(0, index);
}

function localizePrice(number: number | ''): string {
  return number.toLocaleString('ru-RU', {
    style: 'currency',
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
    currency: 'EUR',
  });
}

/**
 * Remove everything after Article name, so
 * OXFORD-160 (Oxford-160, 100% poly, 160gsm, PU600, Green #21-08) becomes OXFORD-160
 * @param article
 * @returns only Article real name
 */
function formatArticle(article: string): string {
  const end = article.indexOf('(');
  return article.substring(0, end === -1 ? undefined : end).trim();
}

export {
  countTotalPrice,
  printStage,
  shortenTitle,
  localizePrice,
  dateConverter,
  removeEmptyProps,
  getTaskTotalPriceHelper,
  formatArticle,
};
