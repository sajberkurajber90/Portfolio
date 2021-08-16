import { useDispatch } from 'react-redux';
import React, { useEffect, useCallback } from 'react';

var KeyPress = function KeyPress() {
  var dispatch = useDispatch();

  var onKeyPressHandler = useCallback(function (event) {
    if (event.key === 'Escape') {
      dispatch({ type: 'MODAL', payload: true });
    }
  }, []);

  useEffect(
    function () {
      window.addEventListener('keydown', onKeyPressHandler);

      return function () {
        window.removeEventListener('keydown', onKeyPressHandler);
      };
    },
    [onKeyPressHandler]
  );

  return null;
};

export default KeyPress;
