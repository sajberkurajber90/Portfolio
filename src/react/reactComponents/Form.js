var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import React, { useEffect } from 'react';
import './Form.css';
import Input from './Input';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import Button from './Button';

var Form = function Form() {
  var history = useHistory();
  // from redux store

  var _useSelector = useSelector(function (state) {
    return state;
  }),
      input = _useSelector.input,
      currentUrl = _useSelector.currentUrl,
      currentWeather = _useSelector.currentWeather;
  // manage button behaviour


  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isEmpty = _useState2[0],
      setIsEmpty = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isInvalid = _useState4[0],
      setIsInvalid = _useState4[1];

  // change hover effect on btn when input invalid


  var hoverHandler = function hoverHandler(bVar) {
    setIsInvalid(bVar);
  };

  // is input existing
  var isExisting = currentWeather.map(function (element) {
    return element.name;
  }).includes(input);

  // dispatch on submition
  var dispatch = useDispatch();

  var submitHandler = function submitHandler(event) {
    event.preventDefault();
    // submition guards
    if (input === null || input === '') {
      setIsEmpty(true);
    }
    if (input !== '' && input !== null && !isExisting) {
      dispatch({ type: 'ALL_INPUTS', source: false });
      setIsEmpty(false);

      history.push('/Home/' + (currentUrl.length === 0 ? input : currentUrl.join('+') + '+' + input));
    }
  };

  // on empty valid again untel submition
  useEffect(function () {
    if (isEmpty) {
      setIsEmpty(false);
    }
  }, [input]);

  return React.createElement(
    'form',
    { onSubmit: submitHandler, className: 'Form' },
    React.createElement(Input, { isEmpty: isEmpty, onHover: hoverHandler, isExisting: isExisting }),
    React.createElement(Button, {
      className: 'Form__button Form__button--color' + (!isInvalid ? '' : '-invalid'),
      label: 'Add'
    })
  );
};

export default Form;