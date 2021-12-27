import { formatArticle, getTotalPriceHelper } from 'helpers';
import DB from 'backend/DBManager';

async function formTaskTitle(
  state: any,
  stAd: any,
  taskId?: string
): Promise<string> {
  const formPretreatmentPart = () => {
    if (state.pretreatment1) {
      return state.pretreatment2.toLowerCase() === 'no' || undefined
        ? ` (${state.pretreatment1})`
        : ` (${state.pretreatment1}; ${state.pretreatment2})`;
    } else {
      return '';
    }
  };

  const convertPriceToStr = (price: number) =>
    price.toLocaleString().replace(',', ' ').replace('.', ',') + ' €';

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

  return standards;
}
export default formTaskTitle;
export { formStandardsPart };
