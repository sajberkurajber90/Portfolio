import { useState, useCallback } from 'react';

const useHttp = function () {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async function (
    url,
    dataTransformer,
    isMounted
  ) {
    try {
      console.log(isMounted.current);
      setIsLoading(true);
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Ups - status:${response.status}`);
      }

      const data = await response.json();

      dataTransformer(data, isMounted);
    } catch (e) {
      console.log(e.message);
      setError(e.message || 'something went wrong - Please try again');
    }
    setIsLoading(false);
  },
  []);

  return {
    isLoading,
    error,
    sendRequest,
  };
};

export default useHttp;
