import { intersection } from 'lodash';
import { TaskState } from 'Task/Task.interface';
import { IInitialState } from 'store/slices/mainSlice';

function filter(tasks: TaskState[], items: any, props: any) {
  let {
    additionalStandardFilterTaskList,
    activeTestingCompanies,
    activeStandards,
    activeBrands,
    stages,
    startDate,
    endDate,
  } = props;

  const brandFilteringFunc = ({ brand }: TaskState) =>
    (brand === '' && activeBrands.includes('No brand')) ||
    activeBrands.includes(brand);

  const testingCompanyFilteringFunc = ({ testingCompany }: TaskState) => {
    testingCompany = testingCompany.split(' ')[0].toLowerCase();
    return activeTestingCompanies.includes(testingCompany);
  };

  // brandfiltering for Certification Tasks
  let filteredTasks = tasks.filter((task) => brandFilteringFunc(task.state));

  // brandfiltering for Items
  let filteredItems = items.filter(brandFilteringFunc);

  if (activeTestingCompanies[0] !== 'all') {
    filteredTasks = filteredTasks.filter((task) =>
      testingCompanyFilteringFunc(task.state)
    );
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
  filteredTasks = filterByStages(stages, filteredTasks);

  return {
    filteredTasks,
    filteredItems,
  };
}

function filterByStages(stages: IInitialState['stages'], filteredTasks: any) {
  let filteredTaskswithStage: any = [];
  stages.forEach((stage) => {
    switch (stage) {
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
            ({ state }: TaskState) => state.stage.match(/^(10|[0-8]\.)/) // all stages starting 0. - 8. and 10.
          )
        );
        break;
      default:
        const filteredTasksByCurrentStage = filteredTasks.filter(
          ({ state }: TaskState) => state.stage === stage
        );

        filteredTaskswithStage = [
          ...filteredTaskswithStage,
          ...filteredTasksByCurrentStage,
        ];
    }
  });

  return filteredTaskswithStage;
}

export default filter;
