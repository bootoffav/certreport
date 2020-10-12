let doughnutOptions = {
  legend: {
    display: false,
  },
  tooltips: {
    callbacks: {
      afterBody: function (toolTipItem: any, passedData: any) {
        const { index } = toolTipItem.pop();
        const stage = passedData.labels[index];
        return passedData.names[stage];
      },
    },
  },
};

export { doughnutOptions };
