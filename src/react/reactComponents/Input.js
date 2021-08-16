import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import useInput from '../hooks/use-input';
import './Input.css';

var Input = function Input(props) {
  // props
  var isEmpty = props.isEmpty;
  var isExisting = props.isExisting;
  var onHoverHandler = props.onHover;

  // inputRef
  var inputRef = useRef('');

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

  // esc hanlder
  var escHandler = function escHandler(event) {
    event.key === 'Escape' ? inputRef.current.blur() : '';
  };
  // style logic
  // check if valid input (no num or special chars or empty input)
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

  if ((value === null || value === '') && isEmpty) {
    style = 'Input__invalid';
  }

  if (isExisting) {
    style = 'Input__invalid';
  }

  // dispatch after render and manage btn apperance
  useEffect(function () {
    dispatch({ type: 'INPUT', input: hasError ? '' : value });
    style === 'Input__invalid' ? onHoverHandler(true) : onHoverHandler(false);
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
      ref: inputRef,
      onChange: inputHandler,
      onFocus: inputFocus,
      onBlur: inputBlur,
      className: 'Input ' + style,
      type: 'text',
      id: 'input',
      placeholder: 'Enter the City Name ...',
      onKeyDown: escHandler
    }),
    React.createElement(
      'p',
      { className: 'Input__p' },
      style === 'Input__invalid' ? isExisting ? value + ' already fetched. Go back and restore it, if not displayed' : 'Invalid Input' : ''
    )
  );
};

export default Input;