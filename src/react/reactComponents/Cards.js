// Mobile : column-flex
// Desktop: row-flex

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Card from './Card';
import './Cards.css';

export default function Cards(props) {
  // props decomposition
  var width = props.width;
  var currentWeather = props.currentWeather;
  var currentUrl = props.currentUrl;
  var errorLocation = props.errorLocation;
  var onClickLocation = props.onClickLocation;
  var convertTempUnit = props.convertTempUnit;
  var forecast = props.forecast;
  // dispatch
  var dispatch = useDispatch();
  // unmount guard
  var isMountedRef = useRef(null);

  // clear error arr
  useEffect(function () {
    isMountedRef.current = true;
    if (errorLocation.length) {
      isMountedRef.current ? dispatch({
        type: 'ERROR',
        clear: true,
        replaceHistory: false
      }) : '';
    }

    return function () {
      isMountedRef.current = false;
    };
  }, [errorLocation.length]);

  var results = void 0;
  currentUrl.length === 0 ? results = null : results = currentUrl.map(function (item, index) {
    return React.createElement(Card, {
      id: item,
      key: item,
      city: item,
      delay: index,
      currentWeather: currentWeather,
      errorLocation: errorLocation,
      currentUrl: currentUrl,
      width: width,
      onClickLocation: onClickLocation,
      convertTempUnit: convertTempUnit,
      forecast: forecast
    });
  });

  return React.createElement(
    'div',
    { className: 'Cards' },
    results
  );
}