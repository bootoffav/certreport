import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { Bar } from 'react-chartjs-2';
import { IInitialState } from 'store/slices/mainSlice';
import { changeTableTasks } from 'store/slices/dashboardSlice';

type BrandChartProps = {
  brand: IInitialState['activeBrands'][number];
};

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function getRandomColors(amount: number): string[] {
  const preDefinedColors = [
    '#808080',
    '#556b2f',
    '#228b22',
    '#7f0000',
    '#483d8b',
    '#008b8b',
    '#000080',
    '#d2691e',
    '#9acd32',
    '#8fbc8f',
    '#8b008b',
    '#ff0000',
    '#ffa500',
    '#ffff00',
    '#7fff00',
    '#8a2be2',
    '#00ff7f',
    '#e9967a',
    '#dc143c',
    '#00ffff',
    '#0000ff',
    '#ff00ff',
    '#1e90ff',
    '#db7093',
    '#f0e68c',
    '#90ee90',
    '#ff1493',
    '#7b68ee',
    '#ee82ee',
    '#87cefa',
  ].sort(() => Math.random() - 0.5);

  if (amount < preDefinedColors.length) {
    return preDefinedColors.slice(0, amount);
  }

  const letters = [
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

  const additionalColors = [];
  for (let i = 0; i < amount - preDefinedColors.length; i++) {
    let color = '#';
    for (let i = 0; i < 6; i++)
      color += letters[Math.floor(Math.random() * 16)];
    additionalColors.push(color);
  }

  return [...preDefinedColors, ...additionalColors];
}

function BrandChart({ brand }: BrandChartProps) {
  const dispatch = useAppDispatch();
  const { tasks, chartResume, activeBrands } = useAppSelector(
    ({
      dashboard: { tasksOfActiveSpendingBlocks: tasks, chartResume },
      main: { activeBrands },
    }) => {
      tasks = tasks.filter(({ state }) => {
        if (state.brand === brand) {
          return chartResume === 'allWithResults' || chartResume === ''
            ? ['pass', 'partly', 'fail'].includes(state.resume)
            : state.resume === chartResume;
        }
        return false;
      });
      return { tasks, chartResume, activeBrands };
    }
  );
  const articles = Array.from(new Set(tasks.map(({ state }) => state.article)));
  const articlesAmount = articles.map((article) => {
    return tasks.reduce((acc, task) => {
      return task.state.article === article ? acc + 1 : acc;
    }, 0);
  });

  const colors = getRandomColors(articles.length);

  const articlesInChartAmount = articlesAmount.reduce(
    (acc, num) => acc + num,
    0
  );

  const data = {
    labels: articles,
    datasets: [
      {
        label:
          `${brand} Products ` +
          (chartResume !== '' ? `(${chartResume})` : '') +
          `: ${articlesInChartAmount}`,
        data: articlesAmount,
        backgroundColor: colors,
      },
    ],
  };

  const options = {
    onClick: (
      {
        chart: {
          data: { labels },
        },
      }: any,
      b: any[]
    ) => {
      try {
        const { index } = b[0];
        dispatch(
          changeTableTasks(
            tasks.filter(({ state }) => state.article === labels[index])
          )
        );
      } catch {} // error happens when user clicks on the area of not chart element
    },
    scales: {
      y: {
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        display: activeBrands.length === 1,
      },
    },
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return <Bar options={options} data={data} />;
}

export default BrandChart;
export { getRandomColors };
