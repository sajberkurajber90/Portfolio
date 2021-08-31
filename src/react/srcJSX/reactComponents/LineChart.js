import LoadingSpinner from './LoadingSpinner';
import { Line, defaults } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Fragment } from 'react';
import { desktopDataPrep } from '../../helper/chartDataPrep';
import { celsiusToFahrenheit } from '../../helper/tempConverter';

const LineChart = function (props) {
  // props
  const isLoading = props.isLoading;
  const forecast = props.forecast;
  const onClickLocation = props.onClickLocation;
  const convertTempUnit = props.convertTempUnit;
  const clickedDay = props.clickedDay;

  const [plotData] = forecast.length
    ? forecast.filter(item => {
        return item.name === onClickLocation;
      })
    : [false];

  console.log(plotData);
  // useEffect to toggle animation
  defaults.animation = false;

  // prepare data for ploting
  const prepData = plotData ? desktopDataPrep(plotData, clickedDay) : false;
  const [timeStamp, temperatureStamp] = prepData ? prepData : [false, false];
  const chartData = prepData
    ? {
        labels: [...timeStamp],
        datasets: [
          {
            label: 'Line',
            data: convertTempUnit
              ? temperatureStamp.map(item => {
                  return celsiusToFahrenheit(item);
                })
              : [...temperatureStamp],
            borderColor: '#f4afc2',
            fill: 'start',
            backgroundColor: '#5d536c',
            pointRadius: 5,
            pointBackgroundColor: '#f4afc2',
            datalabels: {
              align: 'end',
              anchor: 'end',
              offset: 10,
            },
          },
        ],
      }
    : false;

  // temperature scaler
  const minScaler = convertTempUnit ? celsiusToFahrenheit(5) : 5;
  const maxScaler = convertTempUnit ? celsiusToFahrenheit(10) : 10;
  // chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: '#f4afc2',
        formatter: Math.round,
      },
    },
    scales: {
      x: {
        beginAtZero: false,
        grid: { display: false },
        ticks: {
          color: 'pink',
        },
      },
      y: {
        min: temperatureStamp
          ? Math.min(...chartData.datasets[0].data) - minScaler
          : 0,
        max: temperatureStamp
          ? Math.max(...chartData.datasets[0].data) + maxScaler
          : 0,
        grid: { display: false },
        display: false,
      },
    },
  };

  // Chart layout
  let layout =
    isLoading && !plotData ? (
      <LoadingSpinner marginTop={0} className="LoadingSpinner-desktop" />
    ) : (
      <Fragment>
        <Line
          data={chartData}
          plugins={[ChartDataLabels]}
          options={chartOptions}
        />
      </Fragment>
    );

  return layout;
};

export default LineChart;
