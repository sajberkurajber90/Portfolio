var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import React from 'react';
import './Form.css';
import Input from './Input';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';

var Form = function Form() {
  var history = useHistory();
  // from redux store

  var _useSelector = useSelector(function (state) {
    return { input: state.input, query: state.query };
  }),
      input = _useSelector.input,
      query = _useSelector.query;
  // manage button behaviour


  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isEmpty = _useState2[0],
      setIsEmpty = _useState2[1];

  var _useState3 = useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isInvalid = _useState4[0],
      setIsInvalid = _useState4[1];

  var hoverHandler = function hoverHandler(bvar) {
    setIsInvalid(bvar);
  };

  // dispatch on submition
  var dispatch = useDispatch();

  var submitHandler = function submitHandler(event) {
    event.preventDefault();
    // submition guards
    if (input === null) {
      setIsEmpty(true);
    }
    if (input !== '' && input !== null) {
      dispatch({ type: 'ALL_INPUTS' });
      setIsEmpty(false);
      history.push('/Home/' + (query.length === 0 ? input : query.join('+') + '+' + input));
    }
  };

  return React.createElement(
    'form',
    { onSubmit: submitHandler, className: 'Form' },
    React.createElement(Input, { isEmpty: isEmpty, isInvalid: hoverHandler }),
    React.createElement(
      'button',
      {
        className: 'Form__button Form__button--color' + (!isInvalid ? '' : '-invalid')
      },
      'Add'
    )
  );
};

export default Form;