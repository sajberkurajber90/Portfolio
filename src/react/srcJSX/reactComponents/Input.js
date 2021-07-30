import React, { Fragment, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useInput from '../hooks/use-input';
import './Input.css';

const Input = function (props) {
  // custom hook
  const { value, inputHandler, isFocus, hasError, inputBlur, inputFocus } =
    useInput();
  const dispatch = useDispatch();

  //  - check if valid input (no num or special chars or emptyinput)
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
  if (value === null && props.isEmpty) {
    style = 'Input__invalid';
  }

  // dispatch after render
  useEffect(() => {
    dispatch({ type: 'INPUT', input: hasError ? '' : value });
    // console.log(style);
    style === 'Input__invalid' ? props.isInvalid(true) : props.isInvalid(false);
  }, [value, isFocus, props]);

  return (
    <div className="Input__flex">
      <label htmlFor="input" className="Input__label Input__label--color">
        WeatherApp
      </label>
      <input
        onChange={inputHandler}
        onFocus={inputFocus}
        onBlur={inputBlur}
        className={'Input ' + style}
        type="text"
        id="input"
        placeholder="Enter the City Name ..."
      />
      <p>{style === 'Input__invalid' ? 'Invalid Input' : ''}</p>
    </div>
  );
};

export default Input;
