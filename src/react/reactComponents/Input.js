import React, { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useInput from '../hooks/use-input';
import './Input.css';

var Input = function Input(props) {
  // custom hook
  var _useInput = useInput(),
      value = _useInput.value,
      inputHandler = _useInput.inputHandler,
      isFocus = _useInput.isFocus,
      hasError = _useInput.hasError,
      inputBlur = _useInput.inputBlur,
      inputFocus = _useInput.inputFocus;
  // dispatch input validaiton


  var dispatch = useDispatch();

  var isEmpty = props.isEmpty;

  //  - check if valid input (no num or special chars or emptyinput)
  var style = '';
  if (hasError || value === '') {
    style = 'Input__invalid';
  }
  if (isFocus && !hasError) {
    style = 'Input__valid';
  }
  if (isFocus && hasError) {
    style = 'Input__invalid';
  }
  if (value === null && isEmpty) {
    style = 'Input__invalid';
  }

  // dispatch after render and manage btn apperance
  useEffect(function () {
    dispatch({ type: 'INPUT', input: hasError ? '' : value });
    console.log(style);
    style === 'Input__invalid' ? props.isInvalid(true) : props.isInvalid(false);
  }, [value, isFocus, isEmpty]);

  return React.createElement(
    'div',
    { className: 'Input__flex' },
    React.createElement(
      'label',
      { htmlFor: 'input', className: 'Input__label Input__label--color' },
      'WeatherApp'
    ),
    React.createElement('input', {
      onChange: inputHandler,
      onFocus: inputFocus,
      onBlur: inputBlur,
      className: 'Input ' + style,
      type: 'text',
      id: 'input',
      placeholder: 'Enter the City Name ...'
    }),
    React.createElement(
      'p',
      null,
      style === 'Input__invalid' ? 'Invalid Input' : ''
    )
  );
};

export default Input;