import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useMemo } from 'react';
import { useAppSelector } from 'store/hooks';
import { Bar } from 'react-chartjs-2';
import { IInitialState } from 'store/slices/mainSlice';

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

function BranchChart({ brand }: BrandChartProps) {
  const { tasks, chartResume } = useAppSelector(
    ({ dashboard: { tasksOfActiveSpendingBlocks: tasks, chartResume } }) => {
      tasks = tasks.filter(({ state }) => {
        if (state.brand === brand) {
          return chartResume === 'allWithResults' || chartResume === ''
            ? ['pass', 'partly', 'fail'].includes(state.resume)
            : state.resume === chartResume;
        }
        return false;
      });
      return { tasks, chartResume };
    }
  );
  const articles = tasks.map(({ state }) => state.article);
  const articlesAmount = articles.map((article) => {
    return tasks.reduce((acc, task) => {
      return task.state.article === article ? acc + 1 : acc;
    }, 0);
  });

  const colors = useMemo(() => getRandomColors(6), []);

  const data = {
    labels: articles,
    datasets: [
      {
        label:
          `${brand} Products ` + (chartResume !== '' ? `(${chartResume})` : ''),
        data: articlesAmount,
        backgroundColor: colors,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        ticks: {
          stepSize: 1,
        },
      },
      x: {
        display: false,
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

export default BranchChart;
