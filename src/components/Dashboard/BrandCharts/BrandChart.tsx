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
import { Bar } from 'react-chartjs-2';

type BrandChartProps = {
  brand: 'XMT' | 'XMS' | 'XMF';
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

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const data1 = [516, 19, 555, 316, 816, 816, 539];

function BranchChart(props: BrandChartProps) {
  const colors = useMemo(() => getRandomColors(6), [props.brand]);

  const data = {
    labels,
    datasets: [
      {
        label: 'Products',
        data: data1,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `${props.brand} Products`,
      },
    },
  };

  return <Bar options={options} data={data} />;
}

export default BranchChart;
