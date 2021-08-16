import React, { useEffect } from 'react';
import './Form.css';
import Input from './Input';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import Button from './Button';

const Form = function () {
  const history = useHistory();
  // from redux store
  const { input, currentUrl, currentWeather } = useSelector(state => {
    return state;
  });
  // manage button behaviour
  const [isEmpty, setIsEmpty] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  // change hover effect on btn when input invalid
  const hoverHandler = function (bVar) {
    setIsInvalid(bVar);
  };

  // is input existing
  const isExisting = currentWeather
    .map(element => {
      return element.name;
    })
    .includes(input);

  // dispatch on submition
  const dispatch = useDispatch();

  const submitHandler = function (event) {
    event.preventDefault();
    // submition guards
    if (input === null || input === '') {
      setIsEmpty(true);
    }
    if (input !== '' && input !== null && !isExisting) {
      dispatch({ type: 'ALL_INPUTS', source: false });
      setIsEmpty(false);

      history.push(
        `/Home/${
          currentUrl.length === 0 ? input : currentUrl.join('+') + '+' + input
        }`
      );
    }
  };

  // on empty valid again untel submition
  useEffect(() => {
    if (isEmpty) {
      setIsEmpty(false);
    }
  }, [input]);

  return (
    <form onSubmit={submitHandler} className="Form">
      <Input isEmpty={isEmpty} onHover={hoverHandler} isExisting={isExisting} />
      <Button
        className={`Form__button Form__button--color${
          !isInvalid ? '' : '-invalid'
        }`}
        label={'Add'}
      />
    </form>
  );
};

export default Form;
