import './Card.css';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import useHttp from '../hooks/use-http';
import { useEffect, useRef } from 'react';
import { getCurrentWeather } from '../../helper/urls';
import { celsiusToFahrenheit } from '../../helper/tempConverter';
import CloseIcon from './CloseIcon';
import { useHistory } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import WeatherIcons from './WeatherIcons';
import localTimeConversion from '../../helper/localTimeConversion';
import useSwipe from '../hooks/use-swipe';
import RemoveCardMobile from './RemoveCardMobile';
import Chart5DaysMobile from './Chart5DaysMobile';
import cardWidthAdjustment from '../../helper/cardWidthAdjustment';
import CSSTransition from 'react-transition-group/CSSTransition';

// transition style obj - cards
const transitionStyles = {
  exitActive: 'Card__Exit',
};

// animation timing obj
const animationTiming = { exit: 1000 };

// font size adapter
const headingFontSizeDesktop = { fontSize: '15px' };
const headingFontSizeMobile = { fontSize: '18px' };

const fontSizeAdj = function (city, ref, platform) {
  let checkNumOfChars;
  let headingWidth;
  let isStyleAdd;
  switch (platform) {
    case 'mobile':
      checkNumOfChars = city.length > 14 ? 220 : 0; // work around - find better solution
      headingWidth = ref.current ? ref.current.clientWidth : checkNumOfChars;
      isStyleAdd = ref.current ? ref.current.attributes.length === 2 : false;
      return [headingWidth, isStyleAdd];

    case 'desktop':
      checkNumOfChars = city.length > 20 ? 200 : 0; // work around - find better solution
      headingWidth = ref.current ? ref.current.clientWidth : checkNumOfChars;
      isStyleAdd = ref.current ? ref.current.attributes.length === 2 : false;
      return [headingWidth, isStyleAdd];

    default:
      return [0, 0];
  }
};

const Card = function (props) {
  // props decomposition
  const city = props.city; // location
  const width = props.width; // current width for layout purposes
  const delay = props.delay; // defer the http request to avoid server overload on refresh
  const currentweather = props.currentWeather; // whole obj
  const currentUrl = props.currentUrl; // current url
  const errorLocation = props.errorLocation; // error locations
  const isError = errorLocation.includes(city); // if true don't fetch on mount
  const onClickLocation = props.onClickLocation; // clicked card
  const convertTempUnit = props.convertTempUnit; // flag for converting temp units
  const cardId = props.id; // elementId
  const forecast = props.forecast; // 40 hours forecast for loaded cities
  // custom http-hook
  const { isLoading, error: errorHttp, sendRequest, errorHandler } = useHttp();
  // custom swipe-hook for mobile/tablet devices
  const {
    cardRelativeXPos,
    isCardInPos,
    isTapped,
    tappedCity,
    onTouchStart,
    onTouchEnd,
    onTouchMove,
    setIsCardInPos,
    onTapHandler,
    onErrorUntapHandler,
    runAnimCloseChart,
  } = useSwipe();
  // dispatch fun
  const dispatch = useDispatch();
  // is component loaded -  mounted ref
  const isMountedRef = useRef(null);
  // width of city name - for style adjustment - mobile/desktop
  const paragraphWidthRefMobile = useRef(0);
  const paragraphWidthRefDesktop = useRef(0);
  // hostory-hook
  const historyHook = useHistory();
  // click state
  const [isClicked, setIsClicked] = useState(false);
  // removeState
  const [isToRemove, setIsToRemove] = useState(false);

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
    } else {
      const locationUrl = getCurrentWeather(city);

      clear = setTimeout(
        sendRequest.bind(null, locationUrl, dataTransform, isMountedRef),
        100 * delay
      );
    }
    return () => {
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
      }, 3000);
    }

    return () => {
      isMountedRef.current = false;
      remove ? clearInterval(remove) : '';
    };
  }, [errorHttp, isError]);

  // remove card on click close - start the animation
  const removeCardHandler = function () {
    setIsToRemove(true);
  };
  // update hist upon animation completion
  const updateHistoryOnCardRemove = function () {
    if (!errorHttp && !isError) {
      const newUrl = currentUrl.filter(element => {
        return element !== city;
      });
      if (newUrl.length) {
        const dispatchObj = {
          type: 'ALL_INPUTS',
          payload: [...newUrl],
          source: false,
        };
        dispatch(dispatchObj);
        historyHook.push(`/Home/${newUrl.join('+')}`);
      } else {
        const dispatchObj = {
          type: 'ALL_INPUTS',
          payload: [],
          source: false,
        };
        dispatch(dispatchObj);
        historyHook.push(`/Home/`);
      }
    }
  };

  // card focus handler
  const cardClickHandler = function (event) {
    const closeBtn = document.getElementById('close-card');
    // event delegation
    let delegation = true;
    if (event.target.id === closeBtn.id) delegation = false;
    if (event.target.classList && delegation) {
      event.target.classList[0] === 'path' ? (delegation = false) : null;
    }
    if (delegation) {
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
    isMountedRef.current = true;
    if (isClicked && onClickLocation !== city) {
      data && isMountedRef.current ? setIsClicked(false) : '';
    }
    if (!isClicked && onClickLocation === city) {
      data && isMountedRef.current ? setIsClicked(true) : '';
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [city, onClickLocation]);

  // ####################################################
  // defining layout
  let layout;
  // defining inline styles
  let cardStyleDesktop =
    isClicked && onClickLocation === city
      ? {
          transform: 'scale(1.03)',
          boxShadow: '0 0 1rem rgba(255, 192, 203,1)',
        }
      : { justifyContent: errorHttp || isError ? 'center' : 'flex-start' };
  // DESKTOP LAYOUT
  if (width >= 1100) {
    // font size controll
    const [headingWidth, isStyleAdd] = fontSizeAdj(
      city,
      paragraphWidthRefDesktop,
      'desktop'
    );
    layout = (
      <CSSTransition
        in={!isToRemove}
        timeout={animationTiming}
        classNames={transitionStyles}
        onExited={() => {
          
          updateHistoryOnCardRemove();
        }}
      >
        <div
          style={cardStyleDesktop}
          onClick={cardClickHandler}
          className={`Card Card--color ${errorHttp ? 'Card__Error' : ''}`}
          id={cardId}
        >
          {data && (
            <div
              ref={paragraphWidthRefDesktop}
              className={'Card__heading'}
              style={
                headingWidth > 190 || isStyleAdd ? headingFontSizeDesktop : {}
              }
            >
              {city}
            </div>
          )}
          {(errorHttp || isError) && <p>{errorHttp}</p>}
          {data && <p className={'Card__description'}>{data.description}</p>}
          {data && (
            <p className={'Card__temp'}>
              {data
                ? !convertTempUnit
                  ? data.temp.toFixed(1) + '\u00b0' + 'C'
                  : +celsiusToFahrenheit(data.temp).toFixed(1) + '\u00b0' + 'F'
                : null}
            </p>
          )}
          {(isLoading || !data) && !errorHttp ? (
            <LoadingSpinner
              marginTop={8.5}
              className="LoadingSpinner-desktop"
            />
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
              <p className="Card__state">
                {localTimeConversion(data.timezone)}
              </p>
              <CloseIcon
                className="Card__close"
                onClick={removeCardHandler}
                id={'card'}
              />
            </div>
          )}
        </div>
      </CSSTransition>
    );
  }

  // MOBILE LAYOUT
  else {
    // card style setup
    const mobileStyleDesktop = data
      ? cardWidthAdjustment.styleMobile(
          cardRelativeXPos,
          paragraphWidthRefMobile.current
            ? paragraphWidthRefMobile.current.clientWidth
            : 0,
          isCardInPos
        )
      : {
          justifyContent: 'center',
        };
    const styleErrorMsg = { margin: '0', fontSize: '2rem' };
    // animation setup
    const animClass =
      isTapped && data
        ? runAnimCloseChart
          ? 'Card__wrapper-close'
          : 'Card__wrapper-open'
        : '';
    const [headingWidth, isStyleAdd] = fontSizeAdj(
      city,
      paragraphWidthRefMobile,
      'mobile'
    );
    layout = (
      <CSSTransition
        key={city}
        in={!isToRemove}
        timeout={animationTiming}
        classNames={transitionStyles}
        onExited={() => {
          updateHistoryOnCardRemove();
        }}
      >
        <div
          className={`Card__wrapper Card--color ${animClass} ${
            errorHttp ? 'Card__Error' : ''
          }`}
        >
          <div
            onClick={
              data && !runAnimCloseChart
                ? onTapHandler
                : event => {
                    event.preventDefault();
                  }
            }
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onTouchStart={onTouchStart}
            style={mobileStyleDesktop}
            className={`Card Card--color`}
            id={cardId}
          >
            {data && (
              <div
                style={{ left: `${cardRelativeXPos}px` }}
                className="Card__tap-field"
              >
                <p
                  style={{
                    opacity:
                      cardRelativeXPos < 0 || runAnimCloseChart ? '0' : '1',
                  }}
                >
                  {!isTapped ? 'display forecast' : 'close forecast'}
                </p>
              </div>
            )}
            {(errorHttp || isError) && <p style={styleErrorMsg}>{errorHttp}</p>}
            {(isLoading || !data) && !errorHttp ? (
              <LoadingSpinner marginTop={0} className="LoadingSpinner-mobile" />
            ) : null}
            {data && (
              <div className={'Card__box'}>
                <div
                  ref={paragraphWidthRefMobile}
                  className="Card__name"
                  style={
                    headingWidth >= 220 || isStyleAdd
                      ? headingFontSizeMobile
                      : {}
                  }
                >
                  {data.name}
                </div>
                <p className="Card__description">{data.description}</p>
              </div>
            )}
            {data && (
              <div className={'Card__RemoveMobile'}>
                <div className={'Card__box'}>
                  <p className={'Card__temp'}>
                    {data && !convertTempUnit
                      ? data.temp.toFixed(1) + '\u00b0' + 'C'
                      : +celsiusToFahrenheit(data.temp).toFixed(1) +
                        '\u00b0' +
                        'F'}
                  </p>
                  <p className="Card__time">
                    {localTimeConversion(data.timezone)}
                  </p>
                </div>
                <RemoveCardMobile
                  width={cardRelativeXPos}
                  isCardInPos={isCardInPos}
                  setIsCardInPos={setIsCardInPos}
                  currentUrl={currentUrl}
                  city={city}
                  removeCardHandler={removeCardHandler}
                />
              </div>
            )}
          </div>
          {data && isTapped && (
            <Chart5DaysMobile
              tappedCity={tappedCity}
              forecast={forecast}
              onErrorUntapHandler={onErrorUntapHandler}
              convertTempUnit={convertTempUnit}
              runAnimCloseChart={runAnimCloseChart}
            />
          )}
        </div>
      </CSSTransition>
    );
  }

  return layout;
};

export default Card;
