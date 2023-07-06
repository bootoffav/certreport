import assignParentTask, { parentTasksMap } from './assignParentTask';

it('assigns correct parent task id', function () {
  // normal cases
  expect(assignParentTask('2015-03-01', 'XMT')).toBe(58898);
  expect(assignParentTask('2019-04-14', 'XMF')).toBe(46902);
  expect(assignParentTask('2021-11-01', 'XMS')).toBe(71622);
  expect(assignParentTask('2023-07-05', 'XMF')).toBe(114734);
  expect(assignParentTask('2023-07-05', 'XMS')).toBe(114736);
  expect(assignParentTask('2023-07-05', 'XMT')).toBe(114730);
  expect(assignParentTask('2023-07-05', 'XMG')).toBe(114686);
  expect(assignParentTask('2021-09-09', 'XMG')).toBe(71596); // use base year 2021
  expect(assignParentTask('2020-06-09', 'XMT')).toBeDefined();

  // none existent cases
  expect(assignParentTask('2011-11-03', 'XMT')).toBe('');
  const currentYear = new Date().getFullYear();
  expect(assignParentTask()).toBe(
    // @ts-ignore
    parentTasksMap[currentYear].base
  );
  // newly creating task [no CREATED_DATE exists yet]
  expect(assignParentTask('XMF')).toBe('');
});
