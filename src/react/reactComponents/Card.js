var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import React from 'react';
import { useDispatch } from 'react-redux';
import useHttp from '../hooks/use-http';
import { useEffect, useRef } from 'react';
import './Card.css';
import { getCurrentWeather } from '../../helper/urls';

var Card = function Card(props) {
  // props decomposition
  var city = props.city;
  var delay = props.delay; // defer the http request to avoid server overload on refresh
  var currentweather = props.currentWeather; // whole obj

  // custom http-hook

  var _useHttp = useHttp(),
      isLoading = _useHttp.isLoading,
      error = _useHttp.error,
      sendRequest = _useHttp.sendRequest;
  // dispatch fun


  var dispatch = useDispatch();
  // is mounted red
  var isMountedRef = useRef(null);

  // dataTransform fun
  var dataTransform = function dataTransform(data, isMounted) {
    var gatheredData = {
      name: data.name,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      wind: data.wind.speed,
      description: data.weather[0].description,
      id: data.sys.id,
      country: data.sys.country
    };
    // on component unmount don't dispatch
    isMounted.current ? dispatch({
      type: 'ALL_CURRENT',
      current: gatheredData,
      city: city
    }) : console.log('Dipsatch stopped ' + data.name + ' ');
  };

  var _ref = currentweather ? currentweather.filter(function (element) {
    return element.name.includes(city);
  }) : false,
      _ref2 = _slicedToArray(_ref, 1),
      data = _ref2[0];

  // farching data


  useEffect(function () {
    isMountedRef.current = true;
    var clear = null;
    // guard for refetching if data exists or isLoading
    if (data || isLoading) {
      console.log('data loaded or is loading');
    } else {
      console.log('Start Fetch: ' + city);
      var locationUrl = getCurrentWeather(city);
      clear = setTimeout(sendRequest.bind(null, locationUrl, dataTransform, isMountedRef), 100 * delay);
    }
    return function () {
      console.log('START CLEAR');
      isMountedRef.current = false;
      if (clear) clearTimeout(clear);
    };
  }, [city]);

  // unmounting on Error
  useEffect(function () {}, [error]);

  // delete card on btn

  return React.createElement(
    'div',
    { className: 'Card Card--color' },
    React.createElement(
      'p',
      null,
      data ? data.name : city
    ),
    React.createElement(
      'p',
      null,
      data ? Math.floor(data.temp) : 'Loading'
    )
  );
};

export default Card;