import { formatArticle, getTotalPriceHelper } from 'helpers';
import DB from 'backend/DBManager';

const convertPriceToStr = (price: number) => {
  return (
    price.toLocaleString('en-US').replaceAll(',', ' ').replaceAll('.', ',') +
    ' €'
  );
};

async function formTaskTitle(
  state: any,
  stAd: any,
  taskId?: string
): Promise<string> {
  const formPretreatmentPart = () => {
    if (state.pretreatment1) {
      return state.pretreatment2Active && state.pretreatment2
        ? ` (${state.pretreatment1}; ${state.pretreatment2})`
        : ` (${state.pretreatment1})`;
    } else {
      return '';
    }
  };

  return (
    `${state.serialNumber}_${state.testingCompany} - ${await formStandardsPart(
      state.standards,
      taskId
    )}${formPretreatmentPart()} - ${formatArticle(state.article)}, ${
      state.colour
    } ` +
    `(send ${state.sentOn} - plan ${
      state.testFinishedOnPlanDate
    }) = ${convertPriceToStr(
      getTotalPriceHelper(state)
    )} | ${stAd.getStageForTitle()}${stAd.getNADForTitle()}`
  );
}

async function formStandardsPart(standards: any, taskId?: string) {
  try {
    if (taskId) {
      // get standards from DB
      const standardsForTitle = await DB.get(
        taskId,
        'standardsForTitle',
        'certification'
      );
      // only truthy properties goes into title
      return Object.entries(standardsForTitle)
        .filter(([_, v]) => v)
        .map(([p, _]) => p)
        .join(', ');
    }
  } catch {}

  return standards;
}
export default formTaskTitle;
export { formStandardsPart, convertPriceToStr };
