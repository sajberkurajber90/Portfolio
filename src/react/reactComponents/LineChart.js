var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import { useRef, useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Line, defaults } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Fragment } from 'react';
import { desktopDataPrep } from '../../helper/chartDataPrep';
import { celsiusToFahrenheit } from '../../helper/tempConverter';
// setup obj for y - ticks min and max
var yTicks = {
  minC: 0,
  maxC: 0,
  minF: 0,
  maxF: 0,
  init: function init() {
    this.minC = 100;
    this.maxC = -100;
    this.minF = 1000;
    this.maxF = -1000;
  },
  findMin: function findMin(plotData) {
    var _this = this;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = plotData.days[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var day = _step.value;

        plotData[day].forEach(function (item) {
          _this.minC = Math.min(_this.minC, item.temp);
        });
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    this.minF = celsiusToFahrenheit(this.minC);
  },
  findMax: function findMax(plotData) {
    var _this2 = this;

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = plotData.days[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var day = _step2.value;

        plotData[day].forEach(function (item) {
          _this2.maxC = Math.max(_this2.maxC, item.temp);
        });
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2.return) {
          _iterator2.return();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    this.maxF = celsiusToFahrenheit(this.maxC);
  }
};

var animationDuration = 500;

// obj for tracking if unit is changed to prevent stale closer in clean up fun
var unitTrack = { isUnitChange: false };

var LineChart = function LineChart(props) {
  //animation guard on changing devices - make animation active
  defaults.animation.duration === false ? defaults.animation.duration = 0 : null;

  // props
  var isLoading = props.isLoading;
  var forecast = props.forecast;
  var onClickLocation = props.onClickLocation;
  var convertTempUnit = props.convertTempUnit;
  var clickedDay = props.clickedDay;
  var isCardChanged = props.isCardChanged;
  var disableClickHandler = props.disableClickHandler;
  // state

  var _useState = useState(-1),
      _useState2 = _slicedToArray(_useState, 2),
      indexColor = _useState2[0],
      setIndexColor = _useState2[1];

  // ref - access chart's methods


  var lineChartRef = useRef(null);
  // ref - previous day - for animation purposes
  var prevDay = useRef(clickedDay);
  // ref - y coord min and max for whole forecast
  var yMinMax = useRef(null);
  // ref - clickCount
  var renderCount = useRef(0);
  // ref - unitChange
  var unitChangePrev = useRef(convertTempUnit);

  var _ref = forecast.length ? forecast.filter(function (item) {
    return item.name === onClickLocation;
  }) : [false],
      _ref2 = _slicedToArray(_ref, 1),
      plotData = _ref2[0];

  // y coordinates min and max on init and card chage


  if (plotData && (!yMinMax.current || isCardChanged)) {
    yTicks.init(); // overwrite the values from previosly clicked card
    yTicks.findMin(plotData);
    yTicks.findMax(plotData);
    yMinMax.current = {
      minC: yTicks.minC,
      maxC: yTicks.maxC,
      minF: yTicks.minF,
      maxF: yTicks.maxF
    };
  }

  // LOGIC FOR USEEFFECT and TRANSITION MANIPULATION
  // in case of card change - manually reset render counter and prevDay
  isCardChanged && clickedDay ? prevDay.current = clickedDay : null;
  isCardChanged && clickedDay ? renderCount.current = 0 : null;
  // init animation - on init,card change and unit change
  unitTrack.isUnitChange = unitChangePrev.current !== convertTempUnit;
  // update unitChange on change
  unitTrack.isUnitChange ? unitChangePrev.current = convertTempUnit : null;
  if (renderCount.current === 0 || unitTrack.isUnitChange) {
    var duration = defaults.animation.duration;

    duration === animationDuration ? null : defaults.animation.duration = animationDuration;
  }
  // prepare data for ploting - always previous day for animation purposes
  // only on init the init clicked day
  var prepData = plotData ? desktopDataPrep(plotData, prevDay.current !== clickedDay ? prevDay.current : clickedDay) : false;

  var _ref3 = prepData ? prepData : [false, false, false],
      _ref4 = _slicedToArray(_ref3, 3),
      timeStamp = _ref4[0],
      temperatureStamp = _ref4[1],
      descriptionStamp = _ref4[2];

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
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#f6bfce',
      pointBackgroundColor: '#f4afc2',
      pointBorderColor: '#f4afc2',
      pointHoverBorderColor: '#f6bfce',
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
    events: ['mousemove', 'mouseout'],
    onHover: function onHover(_, pointIndex) {
      if (pointIndex.length) {
        pointIndex[0].index === indexColor ? null : setIndexColor(pointIndex[0].index);
      } else {
        indexColor === -1 ? null : setIndexColor(-1);
      }
    },
    plugins: {
      tooltip: {
        backgroundColor: '#5d536c',
        titleColor: '#f4afc2',
        titleMarginBottom: 0,
        yAlign: 'bottom',
        caretPadding: 35,
        callbacks: {
          label: function label() {
            return '';
          },
          title: function title() {
            return indexColor === -1 ? '' : descriptionStamp[indexColor];
          }
        }
      },
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
          color: '#f4afc2'
        }
      },
      y: {
        min: temperatureStamp ? (convertTempUnit ? yMinMax.current.minF : yMinMax.current.minC) - minScaler : 0,
        max: temperatureStamp ? (convertTempUnit ? yMinMax.current.maxF : yMinMax.current.maxC) + maxScaler : 0,
        grid: { display: false },
        display: false
      }
    }
  };

  var cleanUp = {};
  // transition effect
  useEffect(function () {
    // mark previous day
    if (clickedDay !== null) {
      prevDay.current = prevDay.current !== clickedDay ? clickedDay : prevDay.current;
      // stop animation after first render
      if (!lineChartRef.current || !renderCount.current || unitTrack.isUnitChange) {
        cleanUp['init-animation'] = setTimeout(function () {
          defaults.animation.duration = 0;
          renderCount.current++;
          unitTrack.isUnitChange = false;
        }, animationDuration);
      }
      // transition by changing days
      if (lineChartRef.current && !unitTrack.isUnitChange && renderCount.current) {
        defaults.animation.duration = 200;

        var _desktopDataPrep = desktopDataPrep(plotData, clickedDay),
            _desktopDataPrep2 = _slicedToArray(_desktopDataPrep, 2),
            _timeStamp = _desktopDataPrep2[0],
            _temperatureStamp = _desktopDataPrep2[1];

        cleanUp['transition'] = setTimeout(function () {
          // update line chart
          lineChartRef.current.data.datasets[0].data = convertTempUnit ? _temperatureStamp.map(function (item) {
            return celsiusToFahrenheit(item);
          }) : [].concat(_toConsumableArray(_temperatureStamp));
          lineChartRef.current.data.labels = [].concat(_toConsumableArray(_timeStamp));
          lineChartRef.current.update();
          cleanUp['stop-animation'] = setTimeout(function () {
            defaults.animation.duration = 0;
            renderCount.current++;
          }, 5);
        }, 200);
        renderCount.current++;
      }
    }
  }, [clickedDay, convertTempUnit, isCardChanged, onClickLocation, isLoading]);

  useEffect(function () {
    return function () {
      if (Object.keys(cleanUp).length) {
        for (var key in cleanUp) {
          clearTimeout(cleanUp[key]);
        }
      }
    };
  }, []);

  // Chart layout
  var layout = isLoading && !plotData ? React.createElement(LoadingSpinner, { marginTop: 0, className: 'LoadingSpinner-desktop' }) : React.createElement(
    Fragment,
    null,
    React.createElement(Line, {
      ref: lineChartRef,
      data: chartData,
      plugins: [ChartDataLabels],
      options: chartOptions
    })
  );

  return layout;
};

export default LineChart;