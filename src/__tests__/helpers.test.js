import {
  dateConverter,
  printStage,
  isMainHeaderAllowed,
  shortenTitle,
} from '../helpers';

it('correctly converts dates', () => {
  expect(dateConverter('05Mar2019')).toBe('2019-03-05');
  expect(dateConverter('28Jan2027')).toBe('2027-01-28');
  expect(dateConverter('05Mar2019', 'DD.MM.YYYY')).toBe('05.03.2019');
  expect(dateConverter('28Jan2027', 'DD.MM.YYYY')).toBe('28.01.2027');
  expect(dateConverter('')).toBe('');
});

it('checks printStage output', () => {
  // select case
  expect(printStage('00. Paused', 'select')).toBe('Paused');
  expect(printStage('0. Sample to be prepared', 'select')).toBe(
    'Sample to be prepared'
  );
  expect(printStage('1. Sample Sent', 'select')).toBe('Sample Sent');
  expect(printStage('2. Sample Arrived', 'select')).toBe('Sample Arrived');
  expect(printStage('3. PI Issued', 'select')).toBe('PI Issued');
  expect(printStage('4. Payment Done', 'select')).toBe('Payment Done');
  expect(printStage('5. Testing is started', 'select')).toBe(
    'Testing is started'
  );
  expect(printStage('6. Pre-treatment done', 'select')).toBe(
    'Pre-treatment done'
  );
  expect(printStage('7. Test-report ready', 'select')).toBe(
    'Test-report ready'
  );
  expect(printStage('8. Certificate ready', 'select')).toBe(
    'Certificate ready'
  );
  expect(printStage('9. Ended', 'select')).toBe('Ended');

  // table case
  expect(printStage('00. Paused', 'table')).toBe('00.P');
  expect(printStage('0. Sample to be prepared', 'table')).toBe('0.STP');
  expect(printStage('1. Sample Sent', 'table')).toBe('1.SS');
  expect(printStage('2. Sample Arrived', 'table')).toBe('2.SA');
  expect(printStage('3. PI Issued', 'table')).toBe('3.PI');
  expect(printStage('4. Payment Done', 'table')).toBe('4.PD');
  expect(printStage('5. Testing is started', 'table')).toBe('5.TS');
  expect(printStage('6. Pre-treatment done', 'table')).toBe('6.PTD');
  expect(printStage('7. Test-report ready', 'table')).toBe('7.TR');
  expect(printStage('8. Certificate ready', 'table')).toBe('8.CR');
  expect(printStage('9. Ended', 'table')).toBe('9.End');

  // dropdown case
  expect(printStage('00. Paused', 'dropdown')).toBe('00.P - Paused');
  expect(printStage('01. Canceled', 'dropdown')).toBe('01.C - Canceled');
  expect(printStage('02. Estimate', 'dropdown')).toBe('02.E - Estimate');
  expect(printStage('0. Sample to be prepared', 'dropdown')).toBe(
    '0.STP - Sample to be prepared'
  );
  expect(printStage('1. Sample Sent', 'dropdown')).toBe('1.SS - Sample Sent');
  expect(printStage('2. Sample Arrived', 'dropdown')).toBe(
    '2.SA - Sample Arrived'
  );
  expect(printStage('3. PI Issued', 'dropdown')).toBe('3.PI - PI Issued');
  expect(printStage('4. Payment Done', 'dropdown')).toBe('4.PD - Payment Done');
  expect(printStage('5. Testing is started', 'dropdown')).toBe(
    '5.TS - Testing is started'
  );
  expect(printStage('6. Pre-treatment done', 'dropdown')).toBe(
    '6.PTD - Pre-treatment done'
  );
  expect(printStage('7. Test-report ready', 'dropdown')).toBe(
    '7.TR - Test-report ready'
  );
  expect(printStage('8. Certificate ready', 'dropdown')).toBe(
    '8.CR - Certificate ready'
  );
  expect(printStage('9. Ended', 'dropdown')).toBe('9.End - Ended');
});

it('check if pathname allowed', () => {
  expect(isMainHeaderAllowed('/')).toBe(true);
  expect(isMainHeaderAllowed('/articles')).toBe(true);
  expect(isMainHeaderAllowed('/article')).toBe(true);
  expect(isMainHeaderAllowed('/edit')).toBe(true);
  expect(isMainHeaderAllowed('/add')).toBe(true);
});

it('checks shortenTitle', () => {
  expect(
    shortenTitle(
      '038_Aitex (China) - EN 469 (5x60C, ISO 6330) - XM-7104/10, Yellow HighViz (send 15May2015 - plan ) = € | 150723 EN 469 Tape Liso-10 Certificate 2015CN0120 - XM.pdf'
    )
  ).toBe('038_Aitex');

  expect(
    shortenTitle(
      '092_Aitex (China) - EN 20471 (25x60C, ISO 6330) - XM-6002, Silver (send 22Feb2017 - plan 04Apr2017) = 1 602,43 € | 170428 EN 20471 Tape XM-6002 Certificate 2017CN0095 - XM.pdf'
    )
  ).toBe('092_Aitex');

  expect(shortenTitle('092_Aitex')).toBe('092_Aitex');
});
