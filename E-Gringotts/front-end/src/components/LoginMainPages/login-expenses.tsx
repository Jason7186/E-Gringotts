import React from 'react';
import ReactDOM from 'react-dom';
import {useState} from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import 'chart.js/auto';
import './login-expenses.css';

// Registering necessary chart components
ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: {
    labels: string[];
    values: number[];
  };
}

const PieChart: React.FC<PieChartProps> = ( {data} ) => {
  const chartData: ChartData<'pie'> = {
    labels: data.labels,
    datasets: [
      {
        label: 'Amount spent',
        data: data.values,
        backgroundColor: [
          'rgba(255, 99, 132, 0.4)',
          'rgba(54, 162, 235, 0.4)',
          'rgba(255, 206, 86, 0.4)',
          'rgba(75, 192, 192, 0.4)',
          'rgba(153, 102, 255, 0.4)',
          'rgba(255, 159, 64, 0.4)',
          'rgba(233, 30, 99, 0.4)',
          'rgba(0, 188, 212, 0.4)',
          'rgba(76, 175, 80, 0.4)',
          'rgba(63, 81, 181, 0.4)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(233, 30, 99, 1)',
          'rgba(0, 188, 212, 1)',
          'rgba(76, 175, 80, 1)',
          'rgba(63, 81, 181, 1)'
        ],
        borderWidth: 1.5
      }
    ]
  };

  const options: ChartOptions<'pie'> = {
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            const label = tooltipItem.label || '';
            const total = tooltipItem.dataset.data.reduce((acc: number, curr: number) => acc + curr, 0);
            const currentValue = tooltipItem.raw as number;
            const percentage = ((currentValue / total) * 100).toFixed(2) + '%';

            return `${label}: ${currentValue} (${percentage})`;
          }
        }
      }
    },
    responsive: true  
  };

  return (
    <div style={{ width: '100%', height: '85%', backgroundColor: 'white', padding: '5px', textAlign: 'center'}}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

const formatDate = (date: Date) => {
  return date.toISOString().split('T')[0];
};

const LoginExpenses: React.FC = () => {
  const [startDate, setStartDate] = useState<string>(formatDate(new Date()));
  const [endDate, setEndDate] = useState<string>(formatDate(new Date()));
  const [data, setData] = useState({
    labels: ['Fund transfer', 'Food'], // Example labels
    values: [123, 456] // Example data
  });

  return (
    <div className="expenses-background">
      <h1>Divination Data</h1>
      <div className="expenses-container">
        <div className="date-selection">
          <div className="date-input">
            <label htmlFor="start-date">Start Date:</label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="date-input">
            <label htmlFor="end-date">End Date:</label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="expenditure-analysis">
          <h2>Expenditure Analysis:</h2>
          <PieChart data={data}></PieChart>
        </div>
      </div>
    </div>
  );
};

export default LoginExpenses;
