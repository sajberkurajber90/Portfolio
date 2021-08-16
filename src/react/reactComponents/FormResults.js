var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import React, { useState, useEffect, Fragment } from 'react';
import InputResults from './InputResults';
import './FormResults.css';
import Button from './Button';
import { useDispatch } from 'react-redux';
import RefreshIcon from './RefreshIcon';

var FormResults = function FormResults(props) {
  // props
  var input = props.input;
  var currentWeather = props.currentWeather;
  var width = props.width; // for positioning of the refresh icon depending on the device

  // dispatch
  var dispatch = useDispatch();

  // local state

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isEmpty = _useState2[0],
      setIsEmpty = _useState2[1]; // is empty on submition


  var _useState3 = useState(''),
      _useState4 = _slicedToArray(_useState3, 2),
      styleInvalid = _useState4[0],
      setStyleInvalid = _useState4[1]; // style the form and btn on invalid input


  var _useState5 = useState(false),
      _useState6 = _slicedToArray(_useState5, 2),
      clearInput = _useState6[0],
      setClearInput = _useState6[1]; // clearing input field on submit

  var styleHandler = function styleHandler(style) {
    setStyleInvalid(style);
  };

  // already existing on a screen?
  var isExisting = currentWeather.map(function (element) {
    return element.name;
  }).includes(input);

  // style definition
  var styleBorder = '';

  // update styleBorder and error msg
  if (isExisting) {
    styleInvalid !== 'FormResults__wrapper--invalid' ? styleBorder = 'FormResults__wrapper--invalid' : '';
  } else {
    styleBorder = styleInvalid;
  }

  // submition to store handler
  var submitHandler = function submitHandler(event) {
    event.preventDefault();
    // submition guards
    if (input === null || input === '') {
      setIsEmpty(true);
    }
    if (input !== '' && input !== null && !isExisting) {
      dispatch({ type: 'ALL_INPUTS', source: true });
      setIsEmpty(false);
      setClearInput(true); // clear input
    }
  };

  // reset isEmpty state after 1s if empty string is submited
  useEffect(function () {
    var clear = void 0;
    if (isEmpty) {
      clear = setTimeout(setIsEmpty.bind(null, false), 1000);
    }

    // reset state on submition
    return function () {
      if (clear) clearTimeout(clear);
      setClearInput(false);
    };
  }, [isEmpty, clearInput]);

  return React.createElement(
    Fragment,
    null,
    React.createElement(
      'form',
      { onSubmit: submitHandler, className: 'FormResults' },
      React.createElement(
        'div',
        {
          style: {
            display: 'inline-flex',
            alignItems: 'center'
          }
        },
        React.createElement(
          'div',
          { className: 'FormResults__wrapper ' + styleBorder },
          React.createElement(InputResults, {
            isEmpty: isEmpty,
            styleHandler: styleHandler,
            clearInputHandler: clearInput
          }),
          React.createElement(Button, {
            className: 'FormResults__btn FormResults__btn--color' + (styleBorder === 'FormResults__wrapper--invalid' ? '-invalid' : ''),
            label: 'Add'
          })
        ),
        width > 1100 && React.createElement(RefreshIcon, null)
      ),
      React.createElement(
        'p',
        { className: 'FormResults__p' },
        styleBorder !== 'FormResults__wrapper--invalid' ? '' : isExisting ? input + ' is already fatched. If not displayed restore it clicking on Refres button.' : 'Invalid Input'
      )
    ),
    width <= 1100 && React.createElement(RefreshIcon, null)
  );
};

export default FormResults;