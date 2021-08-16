import React, { useState, useEffect, Fragment } from 'react';
import InputResults from './InputResults';
import './FormResults.css';
import Button from './Button';
import { useDispatch } from 'react-redux';
import RefreshIcon from './RefreshIcon';

const FormResults = function (props) {
  // props
  const input = props.input;
  const currentWeather = props.currentWeather;
  const width = props.width; // for positioning of the refresh icon depending on the device

  // dispatch
  const dispatch = useDispatch();

  // local state
  const [isEmpty, setIsEmpty] = useState(false); // is empty on submition
  const [styleInvalid, setStyleInvalid] = useState(''); // style the form and btn on invalid input
  const [clearInput, setClearInput] = useState(false); // clearing input field on submit

  const styleHandler = function (style) {
    setStyleInvalid(style);
  };

  // already existing on a screen?
  const isExisting = currentWeather
    .map(element => {
      return element.name;
    })
    .includes(input);

  // style definition
  let styleBorder = '';

  // update styleBorder and error msg
  if (isExisting) {
    styleInvalid !== 'FormResults__wrapper--invalid'
      ? (styleBorder = 'FormResults__wrapper--invalid')
      : '';
  } else {
    styleBorder = styleInvalid;
  }

  // submition to store handler
  const submitHandler = function (event) {
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
  useEffect(() => {
    let clear;
    if (isEmpty) {
      clear = setTimeout(setIsEmpty.bind(null, false), 1000);
    }

    // reset state on submition
    return () => {
      if (clear) clearTimeout(clear);
      setClearInput(false);
    };
  }, [isEmpty, clearInput]);

  return (
    <Fragment>
      <form onSubmit={submitHandler} className={'FormResults'}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          <div className={`FormResults__wrapper ${styleBorder}`}>
            <InputResults
              isEmpty={isEmpty}
              styleHandler={styleHandler}
              clearInputHandler={clearInput}
            />
            <Button
              className={`FormResults__btn FormResults__btn--color${
                styleBorder === 'FormResults__wrapper--invalid'
                  ? '-invalid'
                  : ''
              }`}
              label={'Add'}
            />
          </div>

          {width > 1100 && <RefreshIcon />}
        </div>
        <p className={'FormResults__p'}>
          {styleBorder !== 'FormResults__wrapper--invalid'
            ? ''
            : isExisting
            ? `${input} is already fatched. If not displayed restore it clicking on Refres button.`
            : 'Invalid Input'}
        </p>
      </form>
      {width <= 1100 && <RefreshIcon />}
    </Fragment>
  );
};

export default FormResults;
