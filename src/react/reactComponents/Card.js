var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import useHttp from '../hooks/use-http';
import { useEffect, useRef } from 'react';
import './Card.css';
import { getCurrentWeather } from '../../helper/urls';
import CloseIcon from './CloseIcon';
import { useHistory } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import WeatherIcons from './WeatherIcons';

var Card = function Card(props) {
  // props decomposition
  var city = props.city; // location
  var width = props.width; // current width for layout purposes
  var delay = props.delay; // defer the http request to avoid server overload on refresh
  var currentweather = props.currentWeather; // whole obj
  var currentUrl = props.currentUrl; // current url
  var errorLocation = props.errorLocation; // error locations
  var isError = errorLocation.includes(city); // if true don't fatch on mount
  var onClickLocation = props.onClickLocation;

  // custom http-hook

  var _useHttp = useHttp(),
      isLoading = _useHttp.isLoading,
      errorHttp = _useHttp.error,
      sendRequest = _useHttp.sendRequest,
      errorHandler = _useHttp.errorHandler;
  // dispatch fun


  var dispatch = useDispatch();
  // is mounted ref
  var isMountedRef = useRef(null);
  // hostory-hook
  var historyHook = useHistory();
  // click state

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isClicked = _useState2[0],
      setIsClicked = _useState2[1];

  // dataTransform fun


  var dataTransform = function dataTransform(data, isMounted) {
    var gatheredData = {
      name: data.name,
      temp: data.main.temp,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      feels_like: data.main.feels_like,
      wind: data.wind.speed,
      description: data.weather[0].description,
      id: data.sys.id,
      country: data.sys.country,
      timezone: data.timezone
    };
    // on component unmount don't dispatch
    isMounted.current ? dispatch({
      type: 'ALL_CURRENT',
      current: gatheredData,
      city: city
    }) : '';
  };
  // console.log('CURRENT WEATHER: ', currentweather);

  var _ref = currentweather ? currentweather.filter(function (element) {
    return element.name.includes(city);
  }) : false,
      _ref2 = _slicedToArray(_ref, 1),
      data = _ref2[0];
  // fetching data


  useEffect(function () {
    isMountedRef.current = true;
    var clear = null;
    // guard for refetching if data exists or isLoading
    if (data || isLoading || isError) {
      console.log('data loaded or is loading or isError');
    } else {
      var locationUrl = getCurrentWeather(city);

      clear = setTimeout(sendRequest.bind(null, locationUrl, dataTransform, isMountedRef), 100 * delay);
    }
    return function () {
      // console.log('START CLEAR', city);
      isMountedRef.current = false;
      if (clear) clearTimeout(clear);
    };
  }, [city]);

  // remove card on error
  useEffect(function () {
    var remove = void 0;
    isMountedRef.current = true;
    if (errorHttp) {
      var dispatchObj = {
        type: 'ERROR',
        payload: city,
        replaceHistory: true
      };
      remove = setTimeout(function () {
        // dispatch if mounted the error location
        errorHttp && isMountedRef.current ? dispatch(dispatchObj) : '';
        // restart the error status
        isMountedRef.current ? errorHandler() : '';
      }, 2000);
    }

    return function () {
      isMountedRef.current = false;
      remove ? clearInterval(remove) : '';
    };
  }, [errorHttp, isError]);

  // remove card on click close
  var removeCardHandler = function removeCardHandler() {
    // guard if error
    if (!errorHttp && !isError) {
      var newUrl = currentUrl.filter(function (element) {
        return element !== city;
      });
      historyHook.push('/Home/' + newUrl.join('+'));
    }
  };
  // console.log(
  //   'CARD: ',
  //   city,
  //   ' is clicked: ',
  //   isClicked,
  //   ' clickedCity: ',
  //   onClickLocation
  // );

  // card focus handler
  var cardClickHandler = function cardClickHandler(event) {
    var closeBtn = document.getElementById('close-card');
    if (event.target.id !== closeBtn.id && event.target.tagName !== closeBtn.children[0].tagName) {
      var dispatchObj = { type: 'ON_CARD_CLICK', payload: city };
      var dispatchEmpty = { type: 'ON_CARD_CLICK', payload: '' };
      data && !isClicked ? dispatch(dispatchObj) : '';
      data && !isClicked ? setIsClicked(function (prev) {
        return !prev;
      }) : '';
      if (onClickLocation === city) {
        data && isClicked ? dispatch(dispatchEmpty) : '';
        data && isClicked ? setIsClicked(function (prev) {
          return !prev;
        }) : '';
      }
    } else {
      // on erase - if focus -> focus the other card
      var newUrl = currentUrl.filter(function (element) {
        return element !== city;
      });
      if (isClicked) {
        var _dispatchObj = {
          type: 'ON_CARD_CLICK',
          payload: newUrl.length ? newUrl.pop() : ''
        };
        dispatch(_dispatchObj);
      }
    }
  };
  // if onClickLocation !== city and clicked unclick
  useEffect(function () {
    if (isClicked && onClickLocation !== city) {
      data ? setIsClicked(false) : '';
    }
    if (!isClicked && onClickLocation === city) {
      data ? setIsClicked(true) : '';
    }
  }, [city, onClickLocation]);

  // defining layout
  var layout = void 0;
  // defining inline style
  var cardStyle = isClicked && onClickLocation === city ? {
    transform: 'scale(1.03)',
    boxShadow: '0 0 1rem rgba(255, 192, 203,1)'
  } : {};
  // DESKTOP LAYOUT
  if (width >= 1100) {
    layout = React.createElement(
      'div',
      {
        style: cardStyle,
        onClick: cardClickHandler,
        className: 'Card Card--color'
      },
      React.createElement(
        'p',
        { className: 'Card__heading' },
        data ? data.name : city
      ),
      (errorHttp || isError) && React.createElement(
        'p',
        null,
        errorHttp
      ),
      data && React.createElement(
        'p',
        { className: 'Card__description' },
        data.description
      ),
      data && React.createElement(
        'p',
        { className: 'Card__temp' },
        data && data.temp.toFixed(1) + '\xB0' + 'C'
      ),
      (isLoading || !data) && !errorHttp ? React.createElement(LoadingSpinner, { marginTop: 5, className: 'LoadingSpinner-desktop' }) : null,
      data && React.createElement(
        'div',
        { className: 'Card__other' },
        React.createElement(
          'div',
          { className: 'Card__icon' },
          React.createElement(WeatherIcons, { id: 'pressure' }),
          React.createElement(
            'p',
            null,
            data.pressure + 'mb'
          )
        ),
        React.createElement(
          'div',
          { className: 'Card__icon' },
          React.createElement(WeatherIcons, { id: 'wind' }),
          React.createElement(
            'p',
            null,
            data.wind.toFixed(1) + 'm/s'
          )
        ),
        React.createElement(
          'div',
          { className: 'Card__icon' },
          React.createElement(WeatherIcons, { id: 'humidity' }),
          React.createElement(
            'p',
            null,
            data.humidity + '%'
          )
        )
      ),
      data && React.createElement(
        'div',
        { className: 'Card__box' },
        React.createElement(
          'p',
          { className: 'Card__state' },
          data.country
        ),
        React.createElement(CloseIcon, {
          className: 'Card__close',
          onClick: removeCardHandler,
          id: 'card'
        })
      )
    );
  }
  // MOBILE LAYOUT
  else {
      var style = data ? {} : { justifyContent: 'center' };
      var styleErrorMsg = { margin: '0', fontSize: '2rem' };
      layout = React.createElement(
        'div',
        { style: style, className: 'Card Card--color' },
        (errorHttp || isError) && React.createElement(
          'p',
          { style: styleErrorMsg },
          errorHttp
        ),
        (isLoading || !data) && !errorHttp ? React.createElement(LoadingSpinner, { marginTop: 0, className: 'LoadingSpinner-mobile' }) : null,
        data && React.createElement(
          'div',
          { className: 'Card__box' },
          React.createElement(
            'p',
            { className: 'Card__name' },
            data.name
          ),
          React.createElement(
            'p',
            { className: 'Card__description' },
            data.description
          )
        ),
        data && React.createElement(
          'div',
          { className: 'Card__box' },
          React.createElement(
            'p',
            { className: 'Card__temp' },
            data.temp.toFixed(1) + '\xB0' + 'C'
          ),
          React.createElement(
            'p',
            { className: 'Card__time' },
            'time'
          )
        )
      );
    }

  return layout;
};

export default Card;