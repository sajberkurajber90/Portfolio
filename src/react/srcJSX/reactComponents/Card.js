import React from 'react';
import { useDispatch } from 'react-redux';
import useHttp from '../hooks/use-http';
import { useEffect, useRef } from 'react';
import './Card.css';
import { getCurrentWeather } from '../../helper/urls';

const Card = function (props) {
  // props decomposition
  const city = props.city;
  const delay = props.delay; // defer the http request to avoid server overload on refresh
  const currentweather = props.currentWeather; // whole obj

  // custom http-hook
  const { isLoading, error, sendRequest } = useHttp();
  // dispatch fun
  const dispatch = useDispatch();
  // is mounted red
  const isMountedRef = useRef(null);

  // dataTransform fun
  const dataTransform = function (data, isMounted) {
    const gatheredData = {
      name: data.name,
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      wind: data.wind.speed,
      description: data.weather[0].description,
      id: data.sys.id,
      country: data.sys.country,
    };
    // on component unmount don't dispatch
    isMounted.current
      ? dispatch({
          type: 'ALL_CURRENT',
          current: gatheredData,
          city: city,
        })
      : console.log(`Dipsatch stopped ${data.name} `);
  };

  const [data] = currentweather
    ? currentweather.filter(element => {
        return element.name.includes(city);
      })
    : false;

  // farching data
  useEffect(() => {
    isMountedRef.current = true;
    let clear = null;
    // guard for refetching if data exists or isLoading
    if (data || isLoading) {
      console.log('data loaded or is loading');
    } else {
      console.log(`Start Fetch: ${city}`);
      const locationUrl = getCurrentWeather(city);
      clear = setTimeout(
        sendRequest.bind(null, locationUrl, dataTransform, isMountedRef),
        100 * delay
      );
    }
    return () => {
      console.log('START CLEAR');
      isMountedRef.current = false;
      if (clear) clearTimeout(clear);
    };
  }, [city]);

  // unmounting on Error
  useEffect(() => {}, [error]);

  // delete card on btn

  return (
    <div className={`Card Card--color`}>
      <p>{data ? data.name : city}</p>
      <p>{data ? Math.floor(data.temp) : 'Loading'}</p>
    </div>
  );
};

export default Card;
