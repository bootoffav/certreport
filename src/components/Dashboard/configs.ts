let chartOptions = {
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
  // tooltips: {
  //   callbacks: {
  //     afterBody: function (toolTipItem: any, passedData: any) {
  //       const { index } = toolTipItem.pop();
  //       const stage = passedData.labels[index];
  //       return passedData.names[stage];
  //     },
  //   },
  // },
};

export { chartOptions };
