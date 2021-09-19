var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import './Chart5DaysMobile.css';
import { useRef, useEffect, useState, Fragment } from 'react';
import BarChart from './BarChart';
import useHttp from '../hooks/use-http';
import { useDispatch } from 'react-redux';
import parseForecast from '../../helper/parseForecast';
import { get5DaysForecast } from '../../helper/urls';

var daysLong = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday'
};

var Chart5DaysMobile = function Chart5DaysMobile(props) {
  // props
  var convertTempUnit = props.convertTempUnit;
  var forecast = props.forecast;
  var tappedCity = props.tappedCity;
  var onErrorUntapHandler = props.onErrorUntapHandler;
  var runAnimCloseChart = props.runAnimCloseChart;
  // state - forecast day tapepd

  var _useState = useState(0),
      _useState2 = _slicedToArray(_useState, 2),
      tappedDayIndex = _useState2[0],
      setTappedDayIndex = _useState2[1];
  // tooltip for weather description on bar tap


  var _useState3 = useState(null),
      _useState4 = _slicedToArray(_useState3, 2),
      toolTip = _useState4[0],
      setToolTip = _useState4[1];

  var toolTipHandler = function toolTipHandler(description) {
    setToolTip(description);
  };

  //  custom http-hook

  var _useHttp = useHttp(),
      isLoading = _useHttp.isLoading,
      errorHttp = _useHttp.error,
      sendRequest = _useHttp.sendRequest,
      errorHandler = _useHttp.errorHandler;
  // is mounted ref


  var isMountedRef = useRef(null);
  // dispatch
  var dispatch = useDispatch();
  // dataTransform func
  var dataTransform = function dataTransform(data, isMounted) {
    var gatheredData = {
      name: data.city.name
    };
    parseForecast(data, gatheredData);

    // guard on unmount
    isMounted.current ? dispatch({ type: 'ALL_5_DAYS_FORECAST', payload: gatheredData }) : '';
  };
  // is foracast already fethced
  var isFetched = forecast.length ? forecast.map(function (item) {
    return item.name;
  }).includes(tappedCity) : false;
  // days array

  var _ref = isFetched ? forecast.filter(function (item) {
    return item.name === tappedCity;
  }) : [false],
      _ref2 = _slicedToArray(_ref, 1),
      weather = _ref2[0];
  // forecasst days


  var days = weather ? [].concat(_toConsumableArray(weather.days)) : false;

  // tapping on a forecast day
  var onTapDayNextIndexHandler = function onTapDayNextIndexHandler() {
    days ? setTappedDayIndex(function (prev) {
      console.log(prev);
      return tappedDayIndex < days.length - 1 ? prev + 1 : prev;
    }) : null;
  };
  var onTapDayPreviousIndexHandler = function onTapDayPreviousIndexHandler() {
    days ? setTappedDayIndex(function (prev) {
      return tappedDayIndex === 0 ? prev : prev - 1;
    }) : null;
  };

  // fetch
  useEffect(function () {
    isMountedRef.current = true;
    if (isFetched || errorHttp) {
      console.log('Loading Chart or Error');
    } else {
      var locationUrl = get5DaysForecast(tappedCity);
      sendRequest(locationUrl, dataTransform, isMountedRef);
    }
    return function () {
      isMountedRef.current = false;
    };
  }, [isFetched]);

  // handling errors
  useEffect(function () {
    var clear = void 0;
    if (errorHttp) {
      clear = setTimeout(function () {
        // remove error
        errorHandler();
        // untap on error and activate closing anim
        onErrorUntapHandler();
      }, 2000);
    }
    return function () {
      clear ? clearTimeout(clear) : '';
    };
  }, [errorHandler, errorHttp]);

  // reset the weather description on both day and unit change
  useEffect(function () {
    setToolTip(function (prev) {
      if (prev) {
        return null;
      }
    });
  }, [tappedDayIndex]);

  // layout
  var layout = errorHttp ? React.createElement(
    'p',
    { className: 'Chart5DaysMobile__error' },
    'Something went wrong try latter'
  ) : isFetched || isLoading ? React.createElement(
    Fragment,
    null,
    React.createElement(
      'div',
      {
        className: 'Chart5DaysMobile__toolTip ',
        style: { opacity: '' + (toolTip ? 1 : 0) },
        onClick: toolTipHandler.bind(null, null)
      },
      toolTip
    ),
    React.createElement(BarChart, {
      isLoading: isLoading,
      convertTempUnit: convertTempUnit,
      tappedDay: days ? days[tappedDayIndex] : 0,
      forecast: forecast,
      tappedCity: tappedCity,
      toolTipHandler: toolTipHandler
    })
  ) : null;

  var animClass = !runAnimCloseChart ? 'Chart5DaysMobile__Enter' : 'Chart5DaysMobile__Exit';

  return React.createElement(
    'div',
    { className: 'Chart5DaysMobile ' + animClass },
    !errorHttp && isFetched ? React.createElement(
      'div',
      { className: 'Chart5DaysMobile__header' },
      React.createElement(
        'div',
        {
          className: 'Chart5DaysMobile__navigation',
          onClick: onTapDayPreviousIndexHandler
        },
        days && tappedDayIndex > 0 && days[tappedDayIndex - 1]
      ),
      React.createElement(
        'div',
        null,
        days ? daysLong[days[tappedDayIndex]] : null
      ),
      React.createElement(
        'div',
        {
          className: 'Chart5DaysMobile__navigation',
          onClick: onTapDayNextIndexHandler
        },
        days && tappedDayIndex < days.length && days[tappedDayIndex + 1]
      )
    ) : null,
    React.createElement(
      'div',
      { className: 'Chart5DaysMobile__Chart' },
      layout
    )
  );
};

export default Chart5DaysMobile;