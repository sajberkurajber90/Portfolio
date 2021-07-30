// CUSTOM HOOK FOR INPUT VALIDITY
import { useReducer } from 'react';

const initilaValue = {
  isFocus: false,
  value: null,
  hasError: false,
};

// regex def
let regx = /[^a-zA-Z\s]+$/;

// reducer
const inputReducer = function (state, action) {
  if (action.type === 'INPUT') {
    return { isFocus: true, value: action.value, hasError: action.hasError };
  }

  if (action.type === 'BLUR') {
    return { isFocus: false, value: state.value, hasError: state.hasError };
  }

  if (action.type === 'FOCUS') {
    return {
      isFocus: true,
      value: state.value ? state.value : '',
      hasError: state.hasError,
    };
  }

  return state;
};

const useInput = function () {
  const [inputState, dispatchLocal] = useReducer(inputReducer, initilaValue);

  // handlers
  // #inputValue
  const inputHandler = function (event) {
    // regex check
    const hasError = Boolean(event.target.value.match(regx)) ? true : false;
    dispatchLocal({
      type: 'INPUT',
      value: event.target.value,
      hasError: hasError,
    });
  };

  // #inputFocus
  const inputFocus = function () {
    dispatchLocal({ type: 'FOCUS' });
  };
  // #inputBlur
  const inputBlur = function () {
    dispatchLocal({ type: 'BLUR' });
  };

  return {
    value: inputState.value,
    isFocus: inputState.isFocus,
    hasError: inputState.hasError,
    inputHandler,
    inputFocus,
    inputBlur,
  };
};

export default useInput;
