import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import useInput from '../hooks/use-input';
import './Input.css';

const Input = function (props) {
  // props
  const isEmpty = props.isEmpty;
  const isExisting = props.isExisting;
  const onHoverHandler = props.onHover;

  // inputRef
  const inputRef = useRef('');

  // custom hook
  const { value, inputHandler, isFocus, hasError, inputBlur, inputFocus } =
    useInput();
  // dispatch input validaiton
  const dispatch = useDispatch();

  // esc hanlder
  const escHandler = function (event) {
    event.key === 'Escape' ? inputRef.current.blur() : '';
  };
  // style logic
  // check if valid input (no num or special chars or empty input)
  let style = '';
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
  useEffect(() => {
    dispatch({ type: 'INPUT', input: hasError ? '' : value });
    style === 'Input__invalid' ? onHoverHandler(true) : onHoverHandler(false);
  }, [value, isFocus, isEmpty]);

  return (
    <div className={'Input__flex'}>
      <label htmlFor="input" className={'Input__label Input__label--color'}>
        WeatherApp
      </label>
      <input
        ref={inputRef}
        onChange={inputHandler}
        onFocus={inputFocus}
        onBlur={inputBlur}
        className={'Input ' + style}
        type="text"
        id="input"
        placeholder="Enter the City Name ..."
        onKeyDown={escHandler}
      />
      <p className={'Input__p'}>
        {style === 'Input__invalid'
          ? isExisting
            ? `${value} already fetched. Go back and restore it, if not displayed`
            : 'Invalid Input'
          : ''}
      </p>
    </div>
  );
};

export default Input;
