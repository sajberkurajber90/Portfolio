var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import LoadingSpinner from './LoadingSpinner';
import { Bar, defaults } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { mobileDataPrep } from '../../helper/chartDataPrep';
import { Fragment, useState, useEffect } from 'react';

var BarChart = function BarChart(props) {
  // props
  var isLoading = props.isLoading;
  var forecast = props.forecast;
  var tappedDay = props.tappedDay;
  var tappedCity = props.tappedCity;
  var convertTempUnit = props.convertTempUnit;
  var toolTipHandler = props.toolTipHandler;
  // state for updating barChart color on click

  var _useState = useState(-1),
      _useState2 = _slicedToArray(_useState, 2),
      indexColor = _useState2[0],
      setIndexColor = _useState2[1];

  // turn off animation


  defaults.animation.duration = false;
  // prepare data for plotting

  var _ref = forecast.length ? forecast.filter(function (item) {
    return item.name === tappedCity;
  }) : [false],
      _ref2 = _slicedToArray(_ref, 1),
      plotData = _ref2[0];

  var prepData = plotData ? mobileDataPrep(plotData, tappedDay, convertTempUnit) : false;

  var _ref3 = prepData ? prepData : [false, false, false, false, false],
      _ref4 = _slicedToArray(_ref3, 5),
      timeStamp = _ref4[0],
      temperatureStamp = _ref4[1],
      min = _ref4[2],
      max = _ref4[3],
      descriptionStamp = _ref4[4];

  var chartData = prepData ? {
    labels: [].concat(_toConsumableArray(timeStamp)),
    datasets: [{
      label: 'Bar',
      data: [].concat(_toConsumableArray(temperatureStamp)),
      backgroundColor: timeStamp.map(function (_, index) {
        if (index === indexColor) {
          return '#f9d7e0';
        }
        return '#f4afc2';
      }),
      fill: 'end',
      datalabels: {
        align: 'end',
        anchor: 'end',
        offset: 5
      }
    }]
  } : false;

  console.log(plotData);
  var chartOtions = {
    responsive: true,
    events: ['click'],
    plugins: {
      legend: { display: false },
      datalabels: {
        color: '#f4afc2',
        formatter: function formatter(val) {
          return Math.floor(val[0]);
        }
      },
      // weather description in tooltip
      tooltip: {
        enabled: false
      }
    },
    // click event
    onClick: function onClick(_, tappedBar) {
      if (tappedBar.length) {
        // check if allready the bar is tapepd
        if (tappedBar[0].index === indexColor) {
          toolTipHandler(null);
          setIndexColor(-1);
        } else {
          setIndexColor(tappedBar[0].index);
          var description = descriptionStamp[tappedBar[0].index];
          toolTipHandler(description);
        }
      } else {
        toolTipHandler(null);
        setIndexColor(-1);
      }
    },
    scales: {
      x: {
        grid: { display: false },
        beginAtzero: false,
        ticks: {
          color: '#f4afc2'
        }
      },
      y: {
        min: temperatureStamp ? min : 0,
        max: temperatureStamp ? max : 0,
        beginAtzero: false,
        grid: { display: false },
        display: false,
        ticks: {
          callback: function callback(val) {
            return val;
          }
        }
      }
    }
  };

  // on day change unclick the bar
  useEffect(function () {
    if (indexColor !== -1) {
      setIndexColor(-1);
      toolTipHandler(null);
    }
  }, [tappedDay]);

  return React.createElement(
    Fragment,
    null,
    isLoading && !plotData && React.createElement(LoadingSpinner, { className: 'LoadingSpinner-mobile', marginTop: 0 }),
    !isLoading && plotData && React.createElement(Bar, {
      data: chartData,
      plugins: [ChartDataLabels],
      options: chartOtions,
      width: 330
    })
  );
};

export default BarChart;