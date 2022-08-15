import { intersection } from 'lodash';

function filter(tasks: any, items: any, props: any) {
  let {
    additionalStandardFilterTaskList,
    activeTestingCompanies,
    activeStandards,
  } = props;

  const brandFilteringFunc = ({ brand }: any) => {
    return brand === '' && props.activeBrands.includes('No brand')
      ? true
      : props.activeBrands.includes(brand);
  };

  const testingCompanyFilteringFunc = ({ testingCompany }: any) => {
    testingCompany = testingCompany.split(' ')[0].toLowerCase();
    return activeTestingCompanies.includes(testingCompany);
  };

  // brandfiltering for Certification Tasks
  let filteredTasks = tasks.filter((task: any) => {
    return brandFilteringFunc(task.state);
  });

  // brandfiltering for Items
  let filteredItems = items.filter(brandFilteringFunc);

  if (activeTestingCompanies[0] !== 'all') {
    // testing company filtering for Certification Tasks
    filteredTasks = filteredTasks.filter(({ state }: any) =>
      testingCompanyFilteringFunc(state)
    );
    // testing company filtering for Items
    filteredItems = filteredItems.filter(testingCompanyFilteringFunc);
  }

  // standardfiltering for Certification Tasks
  if (additionalStandardFilterTaskList) {
    filteredTasks = filteredTasks.filter((task: any) =>
      // @ts-ignore
      additionalStandardFilterTaskList.includes(task.id)
    );
  } else {
    if (activeStandards[0] !== 'all') {
      filteredTasks = filteredTasks.filter((task: any) => {
        const standards = task.state.standards.split(', ');
        return intersection(standards, activeStandards).length;
      });
    }
  }

  // standardFiltering for Items
  if (activeStandards[0] !== 'all') {
    filteredItems = filteredItems.filter(
      ({ standards }: any) => intersection(standards, activeStandards).length
    );
  }

  const { startDate, endDate } = props;
  // datefiltering
  if (startDate && endDate) {
    const sDate = new Date(startDate);
    const eDate = new Date(endDate);
    filteredTasks = filteredTasks.filter((task: any) => {
      const comparingDate = new Date(task.createdDate);
      // @ts-ignore
      return sDate < comparingDate && eDate > comparingDate;
    });
  }

  //stageFiltering
  let filteredTaskswithStage: any = [];
  const searchingStages = [...props.stages];

  while (searchingStages.length) {
    let curStage = searchingStages.shift();
    switch (curStage) {
      case 'all':
        filteredTaskswithStage = [...filteredTasks];
        break;
      case 'overdue':
        filteredTaskswithStage = filteredTaskswithStage.concat(
          filteredTasks.filter((t: any) => t.overdue)
        );
        break;
      case 'ongoing':
        filteredTaskswithStage = filteredTaskswithStage.concat(
          filteredTasks.filter(
            (t: any) => t.state.stage.match(/^(10|[0-8]\.)/) // all stages starting 0. - 8. and 10.
          )
        );
        break;
      default:
        const filteredTasksByCurrentStage = filteredTasks.filter(
          (t: any) => t.state.stage === curStage
        );

        filteredTaskswithStage = [
          ...filteredTaskswithStage,
          ...filteredTasksByCurrentStage,
        ];
    }
  }

  return {
    filteredTasks: filteredTaskswithStage,
    filteredItems,
  };
}

export default filter;
