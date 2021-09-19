import React, { useEffect, useRef } from 'react';
import useInput from '../hooks/use-input';
import { useDispatch } from 'react-redux';
import './InputResults.css';

var InputResults = function InputResults(props) {
  //props
  var isEmpty = props.isEmpty;
  var styleHandler = props.styleHandler;
  var clearInputHandler = props.clearInputHandler;

  // ref
  var inputRef = useRef('');
  // custom hook

  var _useInput = useInput(),
      value = _useInput.value,
      inputHandler = _useInput.inputHandler,
      isFocus = _useInput.isFocus,
      hasError = _useInput.hasError,
      inputBlur = _useInput.inputBlur,
      inputFocus = _useInput.inputFocus,
      clearInput = _useInput.clearInput;

  // dispatch input validaiton


  var dispatch = useDispatch();
  // style properties
  var style = void 0;
  // esc key handler-> blur()
  var onEscHandler = function onEscHandler(event) {
    console.log(event.key);
    event.key === 'Escape' ? inputRef.current.blur() : '';
  };

  // style logic
  if (hasError && isFocus) {
    style = 'invalid';
  }

  if (hasError && inputBlur) {
    style = 'invalid';
  }

  if ((value === null || value === '') && isEmpty) {
    style = 'invalid';
  }

  useEffect(function () {
    clearInputHandler ? clearInput() : ''; // reset input on submit
    clearInputHandler ? inputRef.current.blur() : ''; // trigger onBlur event on successful submition

    dispatch({ type: 'INPUT', input: hasError ? '' : value });
    if (style === 'invalid') {
      styleHandler('FormResults__wrapper--invalid');
    } else {
      isFocus ? styleHandler('FormResults__wrapper--valid') : styleHandler('');
    }
  }, [value, isFocus, isEmpty, clearInputHandler]);

  return React.createElement('input', {
    ref: inputRef,
    onChange: inputHandler,
    onFocus: inputFocus,
    onBlur: inputBlur,
    className: 'InputResults',
    type: 'text',
    placeholder: 'Enter the City Name...',
    value: value ? value : '',
    onKeyDown: onEscHandler
  });
};

export default InputResults;