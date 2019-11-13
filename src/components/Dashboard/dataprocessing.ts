function getData(tasks: any, type: string) {
  const data: any = {};
  data.names = {
    'no stage': [],
    '00. Paused': [],
    '0. Sample to be prepared': [],
    '1. Sample Sent': [],
    '2. Sample arrived': [],
    '3. PI Issued': [],
    '4. Payment Done': [],
    '5. Testing is started': [],
    '6. Pre-treatment done': [],
    '7. Test-report ready': [],
    '8. Certificate ready': [],
    '9. Ended': [],
    'Results': [],
    'Overdue': []
  };


  tasks.forEach((task: any) => {
    (task.state.stage === '')
    ? data.names['no stage'].push(task.TITLE.substring(0, 50))
    : data.names[task.state.stage].push(task.TITLE.substring(0, 50));
  });
  data.labels = Object.keys(data.names);
  const colors = getRandomColors(Object.keys(data.names).length);
  
  data.datasets = [{
    data: Object.keys(data.names).map(stage => data.names[stage].length),
    backgroundColor: colors,
    hoverBackgroundColor: colors,
  }];

  return data;
}

function getRandomColors(amount: number) {
  let letters = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
  const colors = [];
  for (let i = 0; i < amount; i++) {
    let color = '#';
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
    colors.push(color);
  }
  return colors;
}

export { getData };