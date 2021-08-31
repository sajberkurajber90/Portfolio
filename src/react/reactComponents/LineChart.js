var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import LoadingSpinner from './LoadingSpinner';
import { Line, defaults } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Fragment } from 'react';
import { desktopDataPrep } from '../../helper/chartDataPrep';
import { celsiusToFahrenheit } from '../../helper/tempConverter';

var LineChart = function LineChart(props) {
  // props
  var isLoading = props.isLoading;
  var forecast = props.forecast;
  var onClickLocation = props.onClickLocation;
  var convertTempUnit = props.convertTempUnit;
  var clickedDay = props.clickedDay;

  var _ref = forecast.length ? forecast.filter(function (item) {
    return item.name === onClickLocation;
  }) : [false],
      _ref2 = _slicedToArray(_ref, 1),
      plotData = _ref2[0];

  console.log(plotData);
  // useEffect to toggle animation
  defaults.animation = false;

  // prepare data for ploting
  var prepData = plotData ? desktopDataPrep(plotData, clickedDay) : false;

  var _ref3 = prepData ? prepData : [false, false],
      _ref4 = _slicedToArray(_ref3, 2),
      timeStamp = _ref4[0],
      temperatureStamp = _ref4[1];

  var chartData = prepData ? {
    labels: [].concat(_toConsumableArray(timeStamp)),
    datasets: [{
      label: 'Line',
      data: convertTempUnit ? temperatureStamp.map(function (item) {
        return celsiusToFahrenheit(item);
      }) : [].concat(_toConsumableArray(temperatureStamp)),
      borderColor: '#f4afc2',
      fill: 'start',
      backgroundColor: '#5d536c',
      pointRadius: 5,
      pointBackgroundColor: '#f4afc2',
      datalabels: {
        align: 'end',
        anchor: 'end',
        offset: 10
      }
    }]
  } : false;

  // temperature scaler
  var minScaler = convertTempUnit ? celsiusToFahrenheit(5) : 5;
  var maxScaler = convertTempUnit ? celsiusToFahrenheit(10) : 10;
  // chart options
  var chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      datalabels: {
        color: '#f4afc2',
        formatter: Math.round
      }
    },
    scales: {
      x: {
        beginAtZero: false,
        grid: { display: false },
        ticks: {
          color: 'pink'
        }
      },
      y: {
        min: temperatureStamp ? Math.min.apply(Math, _toConsumableArray(chartData.datasets[0].data)) - minScaler : 0,
        max: temperatureStamp ? Math.max.apply(Math, _toConsumableArray(chartData.datasets[0].data)) + maxScaler : 0,
        grid: { display: false },
        display: false
      }
    }
  };

  // Chart layout
  var layout = isLoading && !plotData ? React.createElement(LoadingSpinner, { marginTop: 0, className: 'LoadingSpinner-desktop' }) : React.createElement(
    Fragment,
    null,
    React.createElement(Line, {
      data: chartData,
      plugins: [ChartDataLabels],
      options: chartOptions
    })
  );

  return layout;
};

export default LineChart;