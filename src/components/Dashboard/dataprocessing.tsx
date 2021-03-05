type dataType = {
  names: any;
  labels: any;
  datasets: {
    data: any;
    backgroundColor: any;
    hoverBackgroundColor: any;
  };
};

function byStages(tasks: any): dataType {
  const data: any = {};
  data.names = {
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
  };

  tasks.forEach((task: any) => {
    if (task.hasOwnProperty('state')) {
      // существует state
      task.state.stage === ''
        ? data.names['no stage'].push(task.title.substring(0, 50))
        : data.names[task.state.stage].push(task.title.substring(0, 50));
    } else {
      data.names['no stage'].push(task.title.substring(0, 50));
    }
  });
  data.labels = Object.keys(data.names);
  const colors = getRandomColors(Object.keys(data.names).length);

  data.datasets = [
    {
      data: Object.keys(data.names).map((stage) => data.names[stage].length),
      backgroundColor: colors,
      hoverBackgroundColor: colors,
    },
  ];

  return data;
}

function byProducts(tasks: any): dataType {
  let data: any = { names: {} };
  const articles: any = new Set(
    tasks.map(({ state: { article } }: any) => article || 'no product')
  );
  articles.forEach((article: any) => (data.names[article] = []));

  for (let i = 0; i < tasks.length; i++) {
    tasks[i].state === undefined || tasks[i].state.article === ''
      ? data.names['no product'].push(
          tasks[i].title.substring(0, tasks[i].title.indexOf(' '))
        )
      : data.names[tasks[i].state.article].push(
          tasks[i].title.substring(0, tasks[i].title.indexOf(' '))
        );
  }

  data.labels = Object.keys(data.names);
  const colors = getRandomColors(Object.keys(data.names).length);
  data.datasets = [
    {
      data: Object.keys(data.names).map(
        (article) => data.names[article].length
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
