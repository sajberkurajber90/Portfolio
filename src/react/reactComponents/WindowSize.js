import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

var WindowSize = function WindowSize() {
  var dispatch = useDispatch();

  useEffect(function () {
    var timeoutId = null;

    var resizeListener = function resizeListener() {
      clearInterval(timeoutId);

      timeoutId = setTimeout(function () {
        dispatch({ type: 'RESIZE', width: window.innerWidth });
      }, 150);
    };

    window.addEventListener('resize', resizeListener);

    return function () {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

  return null;
};

export default WindowSize;