import React, { useEffect, useRef } from 'react';
import useInput from '../hooks/use-input';
import { useDispatch } from 'react-redux';
import './InputResults.css';

const InputResults = function (props) {
  //props
  const isEmpty = props.isEmpty;
  const styleHandler = props.styleHandler;
  const clearInputHandler = props.clearInputHandler;

  // ref
  const inputRef = useRef('');
  // custom hook
  const {
    value,
    inputHandler,
    isFocus,
    hasError,
    inputBlur,
    inputFocus,
    clearInput,
  } = useInput();

  // dispatch input validaiton
  const dispatch = useDispatch();
  // style properties
  let style;
  // esc key handler-> blur()
  const onEscHandler = function (event) {
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

  useEffect(() => {
    clearInputHandler ? clearInput() : ''; // reset input on submit
    clearInputHandler ? inputRef.current.blur() : ''; // trigger onBlur event on successful submition

    dispatch({ type: 'INPUT', input: hasError ? '' : value });
    if (style === 'invalid') {
      styleHandler('FormResults__wrapper--invalid');
    } else {
      isFocus ? styleHandler('FormResults__wrapper--valid') : styleHandler('');
    }
  }, [value, isFocus, isEmpty, clearInputHandler]);

  return (
    <input
      ref={inputRef}
      onChange={inputHandler}
      onFocus={inputFocus}
      onBlur={inputBlur}
      className={'InputResults'}
      type="text"
      placeholder="Enter the City Name..."
      value={value ? value : ''}
      onKeyDown={onEscHandler}
    />
  );
};

export default InputResults;
