import { formatArticle, getTotalPriceHelper } from 'helpers';

function formTaskTitle(state: any, stAd: any): string {
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
    `${state.serialNumber}_${state.testingCompany} - ${
      state.standards
    }${formPretreatmentPart()} - ${formatArticle(state.article)}, ${
      state.colour
    } ` +
    `(send ${state.sentOn} - plan ${
      state.testFinishedOnPlanDate
    }) = ${convertPriceToStr(
      getTotalPriceHelper(state)
    )} | ${stAd.getStageForTitle()}${stAd.getNADForTitle()}`
  );
}

export default formTaskTitle;
