/**
 * Converts strings that represent dates in the app.
 * @param {string} oldFormat like '05Mar2019' or ''
 * @param {string} format like 'DD.MM.YYYY'
 * @returns {string} simplification of the ISO 8601 => '2019-03-05'
 */
function dateConverter(oldFormat: string, format: string | undefined = undefined): string {
  if (oldFormat === '') {
    return oldFormat;
  }

  const months: {
    [k: string]: string;
  } = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12'
  };
  switch (format) {
    case 'DD.MM.YYYY':
      return `${oldFormat.slice(0, 2)}.${months[oldFormat.slice(2, 5)]}.${oldFormat.slice(5)}`;
      break;
    case undefined:
      return `${oldFormat.slice(5)}-${months[oldFormat.slice(2, 5)]}-${oldFormat.slice(0, 2)}`;
      break;
    default:
      return '';
  }
}


export { dateConverter };