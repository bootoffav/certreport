import Task, { Stage } from './Task';
import { descriptions } from './Task.descriptions';

let task;

const props = {
  DESCRIPTION: descriptions.BASE,
  UF_CRM_TASK: ["C_10035", "CO_6295"]
}

beforeAll(() => {
  task = new Task(props);
});

it('can determine if description is parseable', () => {
  expect(task.parseable_description(props.DESCRIPTION)).toBe(true);
  expect(task.parseable_description("something else")).toBe(false);
});

it('can distinguish data from other description text', function () {
  const { unParsedTaskState, otherTextInDescription } = task.separateParseableDataAndOtherTextOfDescription(props.DESCRIPTION);
  expect(unParsedTaskState).toBe(`[B]Applicant name:[/B] Aleksei Butov
[B]Product:[/B] 50% Meta Aramid, 50% FR Viscose, FR-Plain 1/1, 120 gsm
[B]Code:[/B] 50A/50V - 120FR - P1
[B]Article:[/B] Aravis-120
[B]Colour:[/B] Dark Navy
[B]Serial number:[/B] 23
[B]Length of sample, meters:[/B] 1
[B]Width of sample, meters:[/B] 1.5
[B]Part number:[/B] 2
[B]Roll number:[/B] 2
[B]Standard:[/B] EN 1149-3 (fail), EN 20471 (Contrast) (pass)
[B]Price:[/B] 12 €
[B]Testing company:[/B] Satra (UK)
[B]Material needed:[/B] 15 lineal meters
[B]Testing time, days:[/B] 21
[B]Pre-treatment 1:[/B] no
[B]Pre-treatment 2:[/B] no
[B]Pre-treatment 3:[/B] no
[B]Sample ready on:[/B] 03Apr2019
[B]to be sent on:[/B] 10Apr2019
[B]to be received on:[/B] 04Apr2019
[B]tests to be started on:[/B] 10Apr2019
[B]tests to be finished on:[/B] 03Apr2019, 10Apr2019
[B]results to be received on:[/B] 04Apr2019, 11Apr2019
[B]Comments:[/B] test
[B]Edit:[/B] [URL=https//certreport.xmtextiles.com/edit/50858/]this task[/URL]`);
  expect(otherTextInDescription).toBe('\n123');
});

it('can parse Task properly', () => {
  let { state } = { ...task };
  expect(state.applicantName).toBe('Aleksei Butov');
  expect(state.product).toBe('50% Meta Aramid, 50% FR Viscose, FR-Plain 1/1, 120 gsm');
  expect(state.article).toBe('Aravis-120');
  expect(state.colour).toBe('Dark Navy');
  expect(state.serialNumber).toBe('23');
  expect(state.length).toBe('1');
  expect(state.width).toBe('1.5');
  expect(state.partNumber).toBe('2');
  expect(state.rollNumber).toBe('2');
  expect(state.standards).toBe('EN 1149-3, EN 20471 (Contrast)');
  expect(state.standardsResult).toEqual({
    'EN 1149-3': 'fail',
    'EN 20471 (Contrast)': 'pass'
  });
  expect(state.price).toBe('12');
  expect(state.testingCompany).toBe('Satra (UK)');
  expect(state.materialNeeded).toBe('15 lineal meters');
  expect(state.testingTime).toBe('21');
  expect(state.pretreatment1).toBe('no');
  expect(state.pretreatment2).toBe('no');
  expect(state.pretreatment3).toBe('no');
  expect(state.readyOn).toBe('03Apr2019');
  expect(state.sentOn).toBe('10Apr2019');
  expect(state.startedOn).toBe('10Apr2019');
  expect(state.receivedOn).toBe('04Apr2019');
  expect(state.testFinishedOnPlanDate).toBe('03Apr2019');
  expect(state.testFinishedOnRealDate).toBe('10Apr2019');
  expect(state.certReceivedOnPlanDate).toBe('04Apr2019');
  expect(state.certReceivedOnRealDate).toBe('11Apr2019');
  expect(state.resume).toBe(undefined);
  expect(state.comments).toBe('test');
  expect(state.link).toBe('[URL=https//certreport.xmtextiles.com/edit/50858/]this task[/URL]');
});

it('can correctly determine Stage', () => {
  expect(task.state.stage).toBe('8. Certificate ready');
});

