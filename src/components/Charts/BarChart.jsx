import 'chart.js/auto';
import PropTypes from 'prop-types';
import { Bar } from 'react-chartjs-2';

const BarChart = ({ beerData, dataType, trailingChar }) => {
  const processData = () => {
    let dataMap = {};
    // Process brewery names
    dataMap = beerData.reduce((acc, item) => {
      const itemValue = item[dataType] || 'Unknown';
      acc[itemValue] = (acc[itemValue] || 0) + 1;
      return acc;
    }, {});

    // Convert to array of objects
    const dataList = Object.keys(dataMap)
      .filter((name) => name !== 'Unknown') // Exclude items where name is "Unknown"
      .map((name) => ({
        name,
        count: dataMap[name],
      }));

    // Sort by count in descending order
    const sortedDataList = dataList.sort((a, b) => a.name - b.name);
    const labels = sortedDataList.map((item) => {
      return `${item.name}${trailingChar}`;
    });
    const data = sortedDataList.map((item) => item.count);

    return { labels, data };
  };

  const { labels, data } = processData();

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: 'total',
        data: data,
        backgroundColor: '#d07d0d', // Gray-600
        hoverOffset: 8,
      },
    ],
  };

  // Skip bar chart when there are no results
  if (labels.length === 0) return 'No data available for a bar chart.';

  return (
    <Bar
      options={{
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: 'rgb(255, 255, 255)',
            },
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.1)',
            },
            ticks: {
              color: 'rgb(255, 255, 255)',
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      }}
      data={chartData}
    />
  );
};

BarChart.propTypes = {
  beerData: PropTypes.array.isRequired,
  dataType: PropTypes.string,
  trailingChar: PropTypes.string,
  hideCount: PropTypes.bool,
};

BarChart.defaultProps = {
  dataType: '',
  trailingChar: '',
  hideCount: false,
};

export default BarChart;
