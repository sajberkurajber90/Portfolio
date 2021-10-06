var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import './Card.css';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import useHttp from '../hooks/use-http';
import { useEffect, useRef } from 'react';
import { getCurrentWeather } from '../../helper/urls';
import { celsiusToFahrenheit } from '../../helper/tempConverter';
import CloseIcon from './CloseIcon';
import { useHistory } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import WeatherIcons from './WeatherIcons';
import localTimeConversion from '../../helper/localTimeConversion';
import useSwipe from '../hooks/use-swipe';
import RemoveCardMobile from './RemoveCardMobile';
import Chart5DaysMobile from './Chart5DaysMobile';
import cardWidthAdjustment from '../../helper/cardWidthAdjustment';
import CSSTransition from 'react-transition-group/CSSTransition';

// transition style obj - cards
var transitionStyles = {
  exitActive: 'Card__Exit'
};

// animation timing obj
var animationTiming = { exit: 1000 };

// font size adapter
var headingFontSizeDesktop = { fontSize: '15px' };
var headingFontSizeMobile = { fontSize: '18px' };

var fontSizeAdj = function fontSizeAdj(city, ref, platform) {
  var checkNumOfChars = void 0;
  var headingWidth = void 0;
  var isStyleAdd = void 0;
  switch (platform) {
    case 'mobile':
      checkNumOfChars = city.length > 14 ? 220 : 0; // work around - find better solution
      headingWidth = ref.current ? ref.current.clientWidth : checkNumOfChars;
      isStyleAdd = ref.current ? ref.current.attributes.length === 2 : false;
      return [headingWidth, isStyleAdd];

    case 'desktop':
      checkNumOfChars = city.length > 20 ? 200 : 0; // work around - find better solution
      headingWidth = ref.current ? ref.current.clientWidth : checkNumOfChars;
      isStyleAdd = ref.current ? ref.current.attributes.length === 2 : false;
      return [headingWidth, isStyleAdd];

    default:
      return [0, 0];
  }
};

var Card = function Card(props) {
  // props decomposition
  var city = props.city; // location
  var width = props.width; // current width for layout purposes
  var delay = props.delay; // defer the http request to avoid server overload on refresh
  var currentweather = props.currentWeather; // whole obj
  var currentUrl = props.currentUrl; // current url
  var errorLocation = props.errorLocation; // error locations
  var isError = errorLocation.includes(city); // if true don't fetch on mount
  var onClickLocation = props.onClickLocation; // clicked card
  var convertTempUnit = props.convertTempUnit; // flag for converting temp units
  var cardId = props.id; // elementId
  var forecast = props.forecast; // 40 hours forecast for loaded cities
  // custom http-hook

  var _useHttp = useHttp(),
      isLoading = _useHttp.isLoading,
      errorHttp = _useHttp.error,
      sendRequest = _useHttp.sendRequest,
      errorHandler = _useHttp.errorHandler;
  // custom swipe-hook for mobile/tablet devices


  var _useSwipe = useSwipe(),
      cardRelativeXPos = _useSwipe.cardRelativeXPos,
      isCardInPos = _useSwipe.isCardInPos,
      isTapped = _useSwipe.isTapped,
      tappedCity = _useSwipe.tappedCity,
      onTouchStart = _useSwipe.onTouchStart,
      onTouchEnd = _useSwipe.onTouchEnd,
      onTouchMove = _useSwipe.onTouchMove,
      setIsCardInPos = _useSwipe.setIsCardInPos,
      onTapHandler = _useSwipe.onTapHandler,
      onErrorUntapHandler = _useSwipe.onErrorUntapHandler,
      runAnimCloseChart = _useSwipe.runAnimCloseChart;
  // dispatch fun


  var dispatch = useDispatch();
  // is component loaded -  mounted ref
  var isMountedRef = useRef(null);
  // width of city name - for style adjustment - mobile/desktop
  var paragraphWidthRefMobile = useRef(0);
  var paragraphWidthRefDesktop = useRef(0);
  // hostory-hook
  var historyHook = useHistory();
  // click state

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isClicked = _useState2[0],
      setIsClicked = _useState2[1];
  // removeState


  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isToRemove = _useState4[0],
      setIsToRemove = _useState4[1];

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

  var _ref = currentweather.length ? currentweather.filter(function (element) {
    return element.name.includes(city);
  }) : [false],
      _ref2 = _slicedToArray(_ref, 1),
      data = _ref2[0];
  // fetching data


  useEffect(function () {
    isMountedRef.current = true;
    var clear = null;
    // guard for refetching if data exists or isLoading
    if (data || isLoading || isError) {} else {
      var locationUrl = getCurrentWeather(city);

      clear = setTimeout(sendRequest.bind(null, locationUrl, dataTransform, isMountedRef), 100 * delay);
    }
    return function () {
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
      }, 3000);
    }

    return function () {
      isMountedRef.current = false;
      remove ? clearInterval(remove) : '';
    };
  }, [errorHttp, isError]);

  // remove card on click close - start the animation
  var removeCardHandler = function removeCardHandler() {
    setIsToRemove(true);
  };
  // update hist upon animation completion
  var updateHistoryOnCardRemove = function updateHistoryOnCardRemove() {
    if (!errorHttp && !isError) {
      var newUrl = currentUrl.filter(function (element) {
        return element !== city;
      });
      if (newUrl.length) {
        var dispatchObj = {
          type: 'ALL_INPUTS',
          payload: [].concat(_toConsumableArray(newUrl)),
          source: false
        };
        dispatch(dispatchObj);
        historyHook.push('/Home/' + newUrl.join('+'));
      } else {
        var _dispatchObj = {
          type: 'ALL_INPUTS',
          payload: [],
          source: false
        };
        dispatch(_dispatchObj);
        historyHook.push('/Home/');
      }
    }
  };

  // card focus handler
  var cardClickHandler = function cardClickHandler(event) {
    var closeBtn = document.getElementById('close-card');
    // event delegation
    var delegation = true;
    if (event.target.id === closeBtn.id) delegation = false;
    if (event.target.classList && delegation) {
      event.target.classList[0] === 'path' ? delegation = false : null;
    }
    if (delegation) {
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
        var _dispatchObj2 = {
          type: 'ON_CARD_CLICK',
          payload: newUrl.length ? newUrl.pop() : ''
        };
        dispatch(_dispatchObj2);
      }
    }
  };
  // if onClickLocation !== city and clicked unclick
  useEffect(function () {
    isMountedRef.current = true;
    if (isClicked && onClickLocation !== city) {
      data && isMountedRef.current ? setIsClicked(false) : '';
    }
    if (!isClicked && onClickLocation === city) {
      data && isMountedRef.current ? setIsClicked(true) : '';
    }

    return function () {
      isMountedRef.current = false;
    };
  }, [city, onClickLocation]);

  // ####################################################
  // defining layout
  var layout = void 0;
  // defining inline styles
  var cardStyleDesktop = isClicked && onClickLocation === city ? {
    transform: 'scale(1.03)',
    boxShadow: '0 0 1rem rgba(255, 192, 203,1)'
  } : { justifyContent: errorHttp || isError ? 'center' : 'flex-start' };
  // DESKTOP LAYOUT
  if (width >= 1100) {
    // font size controll
    var _fontSizeAdj = fontSizeAdj(city, paragraphWidthRefDesktop, 'desktop'),
        _fontSizeAdj2 = _slicedToArray(_fontSizeAdj, 2),
        headingWidth = _fontSizeAdj2[0],
        isStyleAdd = _fontSizeAdj2[1];

    layout = React.createElement(
      CSSTransition,
      {
        'in': !isToRemove,
        timeout: animationTiming,
        classNames: transitionStyles,
        onExited: function onExited() {

          updateHistoryOnCardRemove();
        }
      },
      React.createElement(
        'div',
        {
          style: cardStyleDesktop,
          onClick: cardClickHandler,
          className: 'Card Card--color ' + (errorHttp ? 'Card__Error' : ''),
          id: cardId
        },
        data && React.createElement(
          'div',
          {
            ref: paragraphWidthRefDesktop,
            className: 'Card__heading',
            style: headingWidth > 190 || isStyleAdd ? headingFontSizeDesktop : {}
          },
          city
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
          data ? !convertTempUnit ? data.temp.toFixed(1) + '\xB0' + 'C' : +celsiusToFahrenheit(data.temp).toFixed(1) + '\xB0' + 'F' : null
        ),
        (isLoading || !data) && !errorHttp ? React.createElement(LoadingSpinner, {
          marginTop: 8.5,
          className: 'LoadingSpinner-desktop'
        }) : null,
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
            localTimeConversion(data.timezone)
          ),
          React.createElement(CloseIcon, {
            className: 'Card__close',
            onClick: removeCardHandler,
            id: 'card'
          })
        )
      )
    );
  }

  // MOBILE LAYOUT
  else {
      // card style setup
      var mobileStyleDesktop = data ? cardWidthAdjustment.styleMobile(cardRelativeXPos, paragraphWidthRefMobile.current ? paragraphWidthRefMobile.current.clientWidth : 0, isCardInPos) : {
        justifyContent: 'center'
      };
      var styleErrorMsg = { margin: '0', fontSize: '2rem' };
      // animation setup
      var animClass = isTapped && data ? runAnimCloseChart ? 'Card__wrapper-close' : 'Card__wrapper-open' : '';

      var _fontSizeAdj3 = fontSizeAdj(city, paragraphWidthRefMobile, 'mobile'),
          _fontSizeAdj4 = _slicedToArray(_fontSizeAdj3, 2),
          _headingWidth = _fontSizeAdj4[0],
          _isStyleAdd = _fontSizeAdj4[1];

      layout = React.createElement(
        CSSTransition,
        {
          key: city,
          'in': !isToRemove,
          timeout: animationTiming,
          classNames: transitionStyles,
          onExited: function onExited() {
            updateHistoryOnCardRemove();
          }
        },
        React.createElement(
          'div',
          {
            className: 'Card__wrapper Card--color ' + animClass + ' ' + (errorHttp ? 'Card__Error' : '')
          },
          React.createElement(
            'div',
            {
              onClick: data && !runAnimCloseChart ? onTapHandler : function (event) {
                event.preventDefault();
              },
              onTouchMove: onTouchMove,
              onTouchEnd: onTouchEnd,
              onTouchStart: onTouchStart,
              style: mobileStyleDesktop,
              className: 'Card Card--color',
              id: cardId
            },
            data && React.createElement(
              'div',
              {
                style: { left: cardRelativeXPos + 'px' },
                className: 'Card__tap-field'
              },
              React.createElement(
                'p',
                {
                  style: {
                    opacity: cardRelativeXPos < 0 || runAnimCloseChart ? '0' : '1'
                  }
                },
                !isTapped ? 'display forecast' : 'close forecast'
              )
            ),
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
                'div',
                {
                  ref: paragraphWidthRefMobile,
                  className: 'Card__name',
                  style: _headingWidth >= 220 || _isStyleAdd ? headingFontSizeMobile : {}
                },
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
              { className: 'Card__RemoveMobile' },
              React.createElement(
                'div',
                { className: 'Card__box' },
                React.createElement(
                  'p',
                  { className: 'Card__temp' },
                  data && !convertTempUnit ? data.temp.toFixed(1) + '\xB0' + 'C' : +celsiusToFahrenheit(data.temp).toFixed(1) + '\xB0' + 'F'
                ),
                React.createElement(
                  'p',
                  { className: 'Card__time' },
                  localTimeConversion(data.timezone)
                )
              ),
              React.createElement(RemoveCardMobile, {
                width: cardRelativeXPos,
                isCardInPos: isCardInPos,
                setIsCardInPos: setIsCardInPos,
                currentUrl: currentUrl,
                city: city,
                removeCardHandler: removeCardHandler
              })
            )
          ),
          data && isTapped && React.createElement(Chart5DaysMobile, {
            tappedCity: tappedCity,
            forecast: forecast,
            onErrorUntapHandler: onErrorUntapHandler,
            convertTempUnit: convertTempUnit,
            runAnimCloseChart: runAnimCloseChart
          })
        )
      );
    }

  return layout;
};

export default Card;