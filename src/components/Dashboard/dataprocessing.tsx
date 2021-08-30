import type { ChartData } from 'react-chartjs-2';

function dataAdapter(data: any) {
  if (data === undefined || data.length === 0) return [];

  if (data[0].hasOwnProperty('end') && data[0].hasOwnProperty('start')) {
    return data.reduce((tasks: [], quarter: any) => {
      // @ts-expect-error
      quarter.active && tasks.push(...quarter.tasks);
      return tasks;
    }, []);
  }

  return data;
}

function byStages(rawData: any): ChartData<any> {
  const tasks = dataAdapter(rawData);
  const dataPreparation: { [key: string]: string[] } = {
    'no stage': [],
    '00. Paused': [],
    '01. Canceled': [],
    '02. Estimate': [],
    '0. Sample to be prepared': [],
    '1. Sample Sent': [],
    '2. Sample Arrived': [],
    '3. PI Issued': [],
    '4. Payment Done': [],
    '5. Testing is started': [],
    '6. Pre-treatment done': [],
    '7. Test-report ready': [],
    '8. Certificate ready': [],
    '9. Ended': [],
    '10. Repeat Testing is started': [],
    '11. Repeat Test-report ready': [],
  };

  tasks.forEach((task: any) => {
    if (task.hasOwnProperty('state')) {
      // существует state
      task.state.stage === ''
        ? dataPreparation['no stage'].push(task.title.substring(0, 50))
        : dataPreparation[task.state.stage].push(task.title.substring(0, 50));
    } else {
      dataPreparation['no stage'].push(task.title.substring(0, 50));
    }
  });
  const colors = getRandomColors(Object.keys(dataPreparation).length);

  return {
    labels: Object.keys(dataPreparation),
    datasets: [
      {
        data: Object.values(dataPreparation).map(
          (tasksNames) => tasksNames.length
        ),
        backgroundColor: colors,
        hoverBackgroundColor: colors,
      },
    ],
  };
}

function byProducts(rawData: any): ChartData<any> {
  const dataPreparation: {
    articles: {
      [key: string]: string[];
    };
  } = { articles: {} };

  let data: any = {};
  const tasks = dataAdapter(rawData);
  const uniqueArticles: any = new Set(
    tasks.map(({ state: { article } }: any) => article || 'no product')
  );
  data.labels = [...uniqueArticles];
  uniqueArticles.forEach(
    (article: string) => (dataPreparation.articles[article] = [])
  );

  for (let i = 0; i < tasks.length; i++) {
    tasks[i].state === undefined || tasks[i].state.article === ''
      ? dataPreparation.articles['no product'].push(
          tasks[i].title.substring(0, tasks[i].title.indexOf(' '))
        )
      : dataPreparation.articles[tasks[i].state.article].push(
          tasks[i].title.substring(0, tasks[i].title.indexOf(' '))
        );
  }

  const colors = getRandomColors(data.labels.length);
  data.datasets = [
    {
      data: Object.values(dataPreparation.articles).map(
        (tasksNames) => tasksNames.length
      ),
      backgroundColor: colors,
      hoverBackgroundColor: colors,
    },
  ];

  return data;
}

function getRandomColors(amount: number) {
  let letters = [
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
  ];
  const colors = [];
  for (let i = 0; i < amount; i++) {
    let color = '#';
    for (let i = 0; i < 6; i++)
      color += letters[Math.floor(Math.random() * 16)];
    colors.push(color);
  }
  return colors;
}

export { byStages, byProducts };
