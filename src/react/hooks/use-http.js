import { useState, useCallback } from 'react';

const useHttp = function () {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const errorHandler = useCallback(function () {
    console.log('reset error');
    setError(null);
  }, []);

  const sendRequest = useCallback(async function (
    url,
    dataTransformer,
    isMounted
  ) {
    try {
      setIsLoading(true);
      console.log('START FETCHING: ', url);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ups - status:${response.status}`);
      }

      const data = await response.json();

      dataTransformer(data, isMounted);
    } catch (e) {
      // add no network handler
      setError(e.message || 'Something went wrong - Please try again');
    }
    setIsLoading(false);
  },
  []);

  return {
    isLoading,
    error,
    sendRequest,
    errorHandler,
  };
};

export default useHttp;
