import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import useHttp from '../hooks/use-http';
import { useEffect, useRef } from 'react';
import './Card.css';
import { getCurrentWeather } from '../../helper/urls';
import { celsiusToFahrenheit } from '../../helper/tempConverter';
import CloseIcon from './CloseIcon';
import { useHistory } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import WeatherIcons from './WeatherIcons';
import localTimeConversion from '../../helper/localTimeConversion';
import useSwipe from '../hooks/use-swipe';
import RemoveCardMobile from './RemoveCardMobile';

const Card = function (props) {
  // props decomposition
  const city = props.city; // location
  const width = props.width; // current width for layout purposes
  const delay = props.delay; // defer the http request to avoid server overload on refresh
  const currentweather = props.currentWeather; // whole obj
  const currentUrl = props.currentUrl; // current url
  const errorLocation = props.errorLocation; // error locations
  const isError = errorLocation.includes(city); // if true don't fatch on mount
  const onClickLocation = props.onClickLocation; // clicked card
  const convertTempUnit = props.convertTempUnit; // flag for converting temp units
  const cardId = props.id; // elementId

  // custom http-hook
  const { isLoading, error: errorHttp, sendRequest, errorHandler } = useHttp();
  // custom swipe-hook for mobile/tablet devices
  const {
    cardRelativeXPos,
    isCardInPos,
    isTapped,
    onTouchStart,
    onTouchEnd,
    onTouchMove,
    setIsCardInPos,
    onTapHandler,
  } = useSwipe();
  // dispatch fun
  const dispatch = useDispatch();
  // is mounted ref
  const isMountedRef = useRef(null);
  // hostory-hook
  const historyHook = useHistory();
  // click state
  const [isClicked, setIsClicked] = useState(false);

  // dataTransform fun
  const dataTransform = function (data, isMounted) {
    const gatheredData = {
      name: data.name,
      temp: data.main.temp,
      pressure: data.main.pressure,
      humidity: data.main.humidity,
      feels_like: data.main.feels_like,
      wind: data.wind.speed,
      description: data.weather[0].description,
      id: data.sys.id,
      country: data.sys.country,
      timezone: data.timezone,
    };
    // on component unmount don't dispatch
    isMounted.current
      ? dispatch({
          type: 'ALL_CURRENT',
          current: gatheredData,
          city: city,
        })
      : '';
  };
  // console.log('CURRENT WEATHER: ', currentweather);
  const [data] = currentweather.length
    ? currentweather.filter(element => {
        return element.name.includes(city);
      })
    : [false];
  // fetching data
  useEffect(() => {
    isMountedRef.current = true;
    let clear = null;
    // guard for refetching if data exists or isLoading
    if (data || isLoading || isError) {
      console.log('data loaded or is loading or isError');
    } else {
      const locationUrl = getCurrentWeather(city);

      clear = setTimeout(
        sendRequest.bind(null, locationUrl, dataTransform, isMountedRef),
        100 * delay
      );
    }
    return () => {
      // console.log('START CLEAR', city);
      isMountedRef.current = false;
      if (clear) clearTimeout(clear);
    };
  }, [city]);

  // remove card on error
  useEffect(() => {
    let remove;
    isMountedRef.current = true;
    if (errorHttp) {
      const dispatchObj = {
        type: 'ERROR',
        payload: city,
        replaceHistory: true,
      };
      remove = setTimeout(() => {
        // dispatch if mounted the error location
        errorHttp && isMountedRef.current ? dispatch(dispatchObj) : '';
        // restart the error status
        isMountedRef.current ? errorHandler() : '';
      }, 2000);
    }

    return () => {
      isMountedRef.current = false;
      remove ? clearInterval(remove) : '';
    };
  }, [errorHttp, isError]);

  // remove card on click close
  const removeCardHandler = function () {
    // guard if error
    if (!errorHttp && !isError) {
      const newUrl = currentUrl.filter(element => {
        return element !== city;
      });
      if (newUrl.length) {
        historyHook.push(`/Home/${newUrl.join('+')}`);
      } else {
        const dispatchObj = { type: 'ALL_INPUTS', payload: [], source: true };
        dispatch(dispatchObj);
      }
    }
  };
  // console.log(
  //   'CARD: ',
  //   city,
  //   ' is clicked: ',
  //   isClicked,
  //   ' clickedCity: ',
  //   onClickLocation
  // );

  // card focus handler
  const cardClickHandler = function (event) {
    const closeBtn = document.getElementById('close-card');
    if (
      event.target.id !== closeBtn.id &&
      event.target.tagName !== closeBtn.children[0].tagName
    ) {
      const dispatchObj = { type: 'ON_CARD_CLICK', payload: city };
      const dispatchEmpty = { type: 'ON_CARD_CLICK', payload: '' };
      data && !isClicked ? dispatch(dispatchObj) : '';
      data && !isClicked
        ? setIsClicked(prev => {
            return !prev;
          })
        : '';
      if (onClickLocation === city) {
        data && isClicked ? dispatch(dispatchEmpty) : '';
        data && isClicked
          ? setIsClicked(prev => {
              return !prev;
            })
          : '';
      }
    } else {
      // on erase - if focus -> focus the other card
      const newUrl = currentUrl.filter(element => {
        return element !== city;
      });
      if (isClicked) {
        const dispatchObj = {
          type: 'ON_CARD_CLICK',
          payload: newUrl.length ? newUrl.pop() : '',
        };
        dispatch(dispatchObj);
      }
    }
  };
  // if onClickLocation !== city and clicked unclick
  useEffect(() => {
    if (isClicked && onClickLocation !== city) {
      data ? setIsClicked(false) : '';
    }
    if (!isClicked && onClickLocation === city) {
      data ? setIsClicked(true) : '';
    }
  }, [city, onClickLocation]);

  // defining layout
  let layout;
  // defining inline style
  let cardStyle =
    isClicked && onClickLocation === city
      ? {
          transform: 'scale(1.03)',
          boxShadow: '0 0 1rem rgba(255, 192, 203,1)',
        }
      : {};
  // DESKTOP LAYOUT
  if (width >= 1100) {
    layout = (
      <div
        style={cardStyle}
        onClick={cardClickHandler}
        className={`Card Card--color`}
        id={cardId}
      >
        <p className={'Card__heading'}>{data ? data.name : city}</p>
        {(errorHttp || isError) && <p>{errorHttp}</p>}
        {data && <p className={'Card__description'}>{data.description}</p>}
        {data && (
          <p className={'Card__temp'}>
            {data && !convertTempUnit
              ? data.temp.toFixed(1) + '\u00b0' + 'C'
              : +celsiusToFahrenheit(data.temp).toFixed(1) + '\u00b0' + 'F'}
          </p>
        )}
        {(isLoading || !data) && !errorHttp ? (
          <LoadingSpinner marginTop={5} className="LoadingSpinner-desktop" />
        ) : null}
        {data && (
          <div className={'Card__other'}>
            <div className="Card__icon">
              <WeatherIcons id={'pressure'} />
              <p>{data.pressure + 'mb'}</p>
            </div>
            <div className="Card__icon">
              <WeatherIcons id={'wind'} />
              <p>{data.wind.toFixed(1) + 'm/s'}</p>
            </div>
            <div className="Card__icon">
              <WeatherIcons id={'humidity'} />
              <p>{data.humidity + '%'}</p>
            </div>
          </div>
        )}
        {data && (
          <div className="Card__box">
            <p className="Card__state">{localTimeConversion(data.timezone)}</p>
            <CloseIcon
              className="Card__close"
              onClick={removeCardHandler}
              id={'card'}
            />
          </div>
        )}
      </div>
    );
  }

  // MOBILE LAYOUT
  else {
    const style = data
      ? {}
      : {
          justifyContent: 'center',
        };
    const styleErrorMsg = { margin: '0', fontSize: '2rem' };
    layout = (
      <div
        onClick={onTapHandler}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchStart={onTouchStart}
        style={style}
        className={`Card Card--color`}
        id={cardId}
      >
        {(errorHttp || isError) && <p style={styleErrorMsg}>{errorHttp}</p>}
        {(isLoading || !data) && !errorHttp ? (
          <LoadingSpinner marginTop={0} className="LoadingSpinner-mobile" />
        ) : null}
        {data && (
          <div className={'Card__box'}>
            <p className="Card__name">{data.name}</p>
            <p className="Card__description">{data.description}</p>
          </div>
        )}
        {data && (
          <div className={'Card__RemoveMobile'}>
            <div className={'Card__box'}>
              <p className={'Card__temp'}>
                {data && !convertTempUnit
                  ? data.temp.toFixed(1) + '\u00b0' + 'C'
                  : +celsiusToFahrenheit(data.temp).toFixed(1) + '\u00b0' + 'F'}
              </p>
              <p className="Card__time">{localTimeConversion(data.timezone)}</p>
            </div>
            <RemoveCardMobile
              width={cardRelativeXPos}
              isCardInPos={isCardInPos}
              setIsCardInPos={setIsCardInPos}
              currentUrl={currentUrl}
              city={city}
            />
          </div>
        )}
      </div>
    );
  }

  return layout;
};

export default Card;
