var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import React, { useRef, useEffect, useState } from 'react';
import './Chart5Days.css';
import InputToggleBtn from './InputToggleBtn';
import useHttp from '../hooks/use-http';
import { get5DaysForecast } from '../../helper/urls';
import { useDispatch } from 'react-redux';
import LineChart from './LineChart';
import parseForecast from '../../helper/parseForecast';
import { Fragment } from 'react';
import DayCard from './DayCard';

var Chart5Days = function Chart5Days(props) {
  // props
  var onClickLocation = props.onClickLocation;
  var convertTempUnit = props.convertTempUnit;
  var forecast = props.forecast;
  // state

  var _useState = useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      clickedDay = _useState2[0],
      setClickedDay = _useState2[1];

  var clickDayHandler = function clickDayHandler(click) {
    setClickedDay(click);
  };

  // custom http hooks

  var _useHttp = useHttp(),
      isLoading = _useHttp.isLoading,
      errorHttp = _useHttp.error,
      sendRequest = _useHttp.sendRequest,
      errorHandler = _useHttp.errorHandler;
  // guard ref on unmount


  var isMountedRef = useRef(null);
  // dispatch fun
  var dispatch = useDispatch();
  // guard ref for changing locations
  var locationRef = useRef('');
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
  }).includes(onClickLocation) : false;
  // click location difference

  // fetching
  useEffect(function () {
    isMountedRef.current = true;
    if (onClickLocation === '' || isFetched || errorHttp) {
      console.log('Loading CHART');
    } else {
      var locationUrl = get5DaysForecast(onClickLocation);
      sendRequest(locationUrl, dataTransform, isMountedRef);
    }

    return function () {
      isMountedRef.current = false;
    };
  }, [onClickLocation, isFetched]);

  // handling errors
  useEffect(function () {
    isMountedRef.current = true;
    var clear = void 0;
    if (errorHttp) {
      clear = setTimeout(function () {
        errorHandler();
      }, 2000);
    }
    return function () {
      clear ? clearTimeout(clear) : '';
    };
  }, [errorHandler, errorHttp]);

  // unclick on error
  useEffect(function () {
    var clear = void 0;
    if (errorHttp) {
      var dispatchObj = { type: 'ON_CARD_CLICK', payload: '' };
      clear = setTimeout(function () {
        dispatch(dispatchObj);
      }, 1000);
    }
    return function () {
      clear ? clearTimeout(clear) : '';
    };
  }, [errorHttp]);

  // layout for error or empty
  var layoutEmpty = React.createElement(
    'div',
    { className: 'Chart-no-Data' },
    React.createElement(
      'p',
      null,
      'Please click on card to display 40 hours forecast'
    )
  );
  // error layout
  var layoutError = React.createElement(
    'div',
    { className: 'Chart-no-Data' },
    React.createElement(
      'p',
      null,
      errorHttp
    )
  );

  // days

  var _ref = isFetched ? forecast.filter(function (item) {
    return item.name === onClickLocation;
  }) : [false],
      _ref2 = _slicedToArray(_ref, 1),
      layoutDays = _ref2[0];

  // isCardChanged


  var isCardChanged = locationRef.current !== onClickLocation;
  if (isCardChanged && isFetched) locationRef.current = onClickLocation;

  // set the day on load
  useEffect(function () {
    console.log('EFFECT');
    isFetched && onClickLocation !== '' ? setClickedDay(layoutDays.days[0]) : '';
  }, [onClickLocation, isFetched]);
  // ######################################################
  return React.createElement(
    'div',
    { className: 'Chart5Days', id: 'chart' },
    React.createElement(
      'div',
      { className: 'Chart5Days__header' },
      React.createElement(
        'h1',
        null,
        onClickLocation !== '' && !errorHttp ? onClickLocation : ''
      ),
      React.createElement(InputToggleBtn, null)
    ),
    onClickLocation !== '' && !errorHttp ? React.createElement(
      Fragment,
      null,
      React.createElement(
        'div',
        { className: 'Chart__days' },
        layoutDays ? layoutDays.days.map(function (item, index) {
          return React.createElement(DayCard, {
            key: index,
            day: item,
            onClick: clickDayHandler,
            clickedDay: isCardChanged && isFetched ? layoutDays.days[0] : clickedDay
          });
        }) : null
      ),
      React.createElement(
        'div',
        { className: 'Chart' },
        React.createElement(LineChart, {
          isLoading: isLoading,
          forecast: forecast,
          onClickLocation: onClickLocation,
          convertTempUnit: convertTempUnit,
          clickedDay: isCardChanged && isFetched ? layoutDays.days[0] : clickedDay
        })
      )
    ) : null,
    onClickLocation === '' && !errorHttp ? layoutEmpty : '',
    errorHttp && layoutError
  );
};

export default Chart5Days;