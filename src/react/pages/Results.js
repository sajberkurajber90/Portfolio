function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

import React, { useEffect } from 'react';
import './Results.css';
import Cards from '../reactComponents/Cards';
import Chart5Days from '../reactComponents/Chart5Days';
import { useParams, useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import FormResults from '../reactComponents/FormResults';
import DashBoard from '../reactComponents/DashBoard';
import ModalLoadedCities from '../reactComponents/ModalLoadedCities';
import InputToggleBtn from '../reactComponents/InputToggleBtn';
import isContentSame from '../../helper/isContentSame';

var generateOrdinalIndicator = function generateOrdinalIndicator(date) {
  var extractNumber = +date.split(' ')[1];
  if (extractNumber === 1) return 'st';
  if (extractNumber === 2) return 'nd';
  if (extractNumber === 3) return 'rd';
  if (extractNumber > 3) return 'th';
};

var Results = function Results() {
  var today = new Date().toLocaleDateString('en-us', {
    day: 'numeric',
    month: 'long'
  });

  var todayJsx = React.createElement(
    'span',
    null,
    generateOrdinalIndicator(today)
  );

  // dispatch and history fun
  var dispatch = useDispatch();
  var historyHook = useHistory();
  // get the state

  var _useSelector = useSelector(function (state) {
    return state;
  }),
      input = _useSelector.input,
      width = _useSelector.winWidth,
      currentWeather = _useSelector.currentWeather,
      replaceHistory = _useSelector.replaceHistory,
      currentUrl = _useSelector.currentUrl,
      inputSource = _useSelector.inputSource,
      modalHidden = _useSelector.modalHidden,
      errorLocation = _useSelector.errorLocation,
      onClickLocation = _useSelector.onClickLocation,
      convertTempUnit = _useSelector.convertTempUnit,
      forecast = _useSelector.forecast;
  // on refreash


  var _useParams = useParams(),
      urlData = _useParams.cities;
  // filter url data


  urlData = urlData.split('+').filter(function (element) {
    return !errorLocation.includes(element);
  });
  var urlLen = urlData.length; // url form the url bar
  var urlArr = [].concat(_toConsumableArray(new Set(urlData))); // unique values w
  var isDuplicate = urlArr.length !== urlLen; // on duplicates replace history
  var same = isContentSame(urlData, currentUrl, errorLocation); // check content of the url and store url arr
  // update url
  useEffect(function () {
    if (!same) {
      if (replaceHistory || isDuplicate) {
        console.log('REPLACING HISTORY');
        historyHook.replace(isDuplicate ? '/Home/' + urlArr.join('+') : '/Home/' + currentUrl.join('+'));
        dispatch({ type: 'RESET' });
      }
      if (!replaceHistory && inputSource) {
        console.log('PUSHING HISTORY');
        historyHook.push('/Home/' + currentUrl.join('+'));
      }
    }
  }, [currentUrl.join('+'), isDuplicate]);

  // on manual url update and refreash
  useEffect(function () {
    if (!inputSource && !replaceHistory && !same) {
      console.log('UPDATING CURRENT URL');

      dispatch({
        type: 'ALL_INPUTS',
        payload: urlArr,
        source: false
      });
    }
  }, [urlArr.join('+'), inputSource]);

  // on manual url change unclick the clicked card - if it doesnt' exist in url
  useEffect(function () {
    if (onClickLocation !== '') {
      var isIncludedInURL = urlArr.includes(onClickLocation);
      isIncludedInURL ? null : dispatch({ type: 'ON_CARD_CLICK', payload: '' });
    }
  }, [urlArr.join('+')]);

  return React.createElement(
    'section',
    { className: 'Results' },
    React.createElement(ModalLoadedCities, {
      currentWeather: currentWeather,
      currentUrl: currentUrl,
      isHidden: modalHidden
    }),
    React.createElement(
      'h1',
      { className: 'Results__header' },
      'Weather for ',
      today,
      todayJsx
    ),
    width >= 1100 && React.createElement(FormResults, {
      input: input,
      currentWeather: currentWeather,
      width: width
    }),
    width < 1100 && React.createElement(
      'div',
      { className: 'Results__toggle' },
      React.createElement(
        'p',
        null,
        'Swipe a card to left to remove it'
      ),
      React.createElement(InputToggleBtn, { width: width })
    ),
    React.createElement(
      DashBoard,
      null,
      React.createElement(Cards, {
        currentWeather: currentWeather,
        width: width,
        currentUrl: currentUrl,
        errorLocation: errorLocation,
        onClickLocation: onClickLocation,
        convertTempUnit: convertTempUnit,
        forecast: forecast
      }),
      width >= 1100 ? React.createElement(Chart5Days, {
        onClickLocation: onClickLocation,
        convertTempUnit: convertTempUnit,
        forecast: forecast,
        currentUrl: currentUrl,
        width: width
      }) : null
    ),
    width < 1100 && React.createElement(FormResults, {
      input: input,
      currentWeather: currentWeather,
      width: width
    })
  );
};

export default Results;