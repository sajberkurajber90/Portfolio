import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const WindowSize = function () {
  const dispatch = useDispatch();

  useEffect(() => {
    let timeoutId = null;

    const resizeListener = () => {
      clearInterval(timeoutId);

      timeoutId = setTimeout(() => {
        dispatch({ type: 'RESIZE', width: window.innerWidth });
      }, 150);
    };

    window.addEventListener('resize', resizeListener);

    return () => {
      window.removeEventListener('resize', resizeListener);
    };
  }, []);

  return null;
};

export default WindowSize;
