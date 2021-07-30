import React from 'react';
import './Form.css';
import Input from './Input';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';

const Form = function () {
  const history = useHistory();
  // from redux store
  const { input, query } = useSelector(state => {
    return { input: state.input, query: state.query };
  });
  // manage button behaviour
  const [isEmpty, setIsEmpty] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const hoverHandler = function (bvar) {
    setIsInvalid(bvar);
  };

  // dispatch on submition
  const dispatch = useDispatch();

  const submitHandler = function (event) {
    event.preventDefault();
    // submition guards
    if (input === null) {
      setIsEmpty(true);
    }
    if (input !== '' && input !== null) {
      dispatch({ type: 'ALL_INPUTS' });
      setIsEmpty(false);
      history.push(
        `/Home/${query.length === 0 ? input : query.join('+') + '+' + input}`
      );
    }
  };

  return (
    <form onSubmit={submitHandler} className="Form">
      <Input isEmpty={isEmpty} isInvalid={hoverHandler} />
      <button
        className={`Form__button Form__button--color${
          !isInvalid ? '' : '-invalid'
        }`}
      >
        Add
      </button>
    </form>
  );
};

export default Form;
