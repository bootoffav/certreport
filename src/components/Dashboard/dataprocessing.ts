function getData(tasks: any, type: string) {
    const data: any = {};
    const stages: {
      [key: string]: number;
    } = {
      'no stage': 0,
      '00. Paused': 0,
      '0. Sample to be prepared': 0,
      '1. Sample Sent': 0,
      '2. Sample arrived': 0,
      '3. PI Issued': 0,
      '4. Payment Done': 0,
      '5. Testing is started': 0,
      '6. Pre-treatment done': 0,
      '7. Test-repost ready': 0,
      '8. Certificate ready': 0,
      '9. Ended': 0,
      'Results': 0,
      'Overdue': 0
    };
    tasks.forEach((task: any) => {
      task.state.stage === '' ? stages['no stage']++ : stages[task.state.stage]++;
    })
    data.labels = Object.keys(stages);
    const colors = getRandomColors(Object.keys(stages).length);

    data.datasets = [{
      data: Object.values(stages),
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