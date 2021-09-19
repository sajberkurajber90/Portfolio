import React, { useRef, useEffect, useState } from 'react';
import './Chart5Days.css';
import InputToggleBtn from './InputToggleBtn';
import useHttp from '../hooks/use-http';
import { get5DaysForecast } from '../../helper/urls';
import { useDispatch } from 'react-redux';
import LineChart from './LineChart';
import parseForecast from '../../helper/parseForecast';
import { Fragment } from 'react';
import DayCard from './DayCard';

const Chart5Days = function (props) {
  // props
  const onClickLocation = props.onClickLocation;
  const convertTempUnit = props.convertTempUnit;
  const forecast = props.forecast;
  const width = props.width;
  // state

  // disable day clicks during the animation
  const [disableClick, setDisableClick] = useState(null);

  const [clickedDay, setClickedDay] = useState(null);
  const clickDayHandler = function (click) {
    setClickedDay(click);
  };

  // reset flag - isCardChanged after card change by inducing a render
  const [reRender, setReRender] = useState(false);

  // custom http hooks
  const { isLoading, error: errorHttp, sendRequest, errorHandler } = useHttp();
  // guard ref on unmount
  const isMountedRef = useRef(null);
  // dispatch fun
  const dispatch = useDispatch();
  // guard ref for changing locations
  const locationRef = useRef('');
  // dataTransform func
  const dataTransform = function (data, isMounted) {
    const gatheredData = {
      name: data.city.name,
    };

    parseForecast(data, gatheredData);

    // guard on unmount
    isMounted.current
      ? dispatch({ type: 'ALL_5_DAYS_FORECAST', payload: gatheredData })
      : '';
  };

  // is foracast already fethced
  const isFetched = forecast.length
    ? forecast
        .map(item => {
          return item.name;
        })
        .includes(onClickLocation)
    : false;
  // click location difference

  // fetching
  useEffect(() => {
    isMountedRef.current = true;
    if (onClickLocation === '' || isFetched || errorHttp) {
    } else {
      const locationUrl = get5DaysForecast(onClickLocation);
      sendRequest(locationUrl, dataTransform, isMountedRef);
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [onClickLocation, isFetched]);

  // handling errors
  useEffect(() => {
    isMountedRef.current = true;
    let clear;
    if (errorHttp) {
      clear = setTimeout(() => {
        errorHandler();
      }, 2000);
    }
    return () => {
      clear ? clearTimeout(clear) : '';
    };
  }, [errorHandler, errorHttp]);

  // unclick on error
  useEffect(() => {
    let clear;
    if (errorHttp) {
      const dispatchObj = { type: 'ON_CARD_CLICK', payload: '' };
      clear = setTimeout(() => {
        dispatch(dispatchObj);
      }, 1000);
    }
    return () => {
      clear ? clearTimeout(clear) : '';
    };
  }, [errorHttp]);

  // layout for error / empty
  const layoutEmpty = (
    <div className="Chart-no-Data">
      <p>Click on a card to display 40 hours forecast</p>
    </div>
  );
  // error layout
  const layoutError = (
    <div className="Chart-no-Data">
      <p>{errorHttp}</p>
    </div>
  );

  // days
  const [layoutDays] = isFetched
    ? forecast.filter(item => {
        return item.name === onClickLocation;
      })
    : [false];

  // isCardChanged
  const isCardChanged =
    onClickLocation === '' ? false : locationRef.current !== onClickLocation;
  if (isCardChanged && isFetched) locationRef.current = onClickLocation;
  // set the day on load
  useEffect(() => {
    if (isFetched && onClickLocation !== '') {
      isCardChanged ? setClickedDay(layoutDays.days[0]) : '';
      isCardChanged &&
        setReRender(prev => {
          return !prev;
        });
    }
  }, [onClickLocation, isFetched, reRender]);
  // ######################################################
  return (
    <div className="Chart5Days" id={'chart'}>
      <div className="Chart5Days__header">
        <h1>{onClickLocation !== '' && !errorHttp ? onClickLocation : ''}</h1>
        <InputToggleBtn width={width} convertTempUnit={convertTempUnit} />
      </div>
      {onClickLocation !== '' && !errorHttp ? (
        <Fragment>
          <div className="Chart__days">
            {layoutDays
              ? layoutDays.days.map((item, index) => {
                  return (
                    <DayCard
                      onClickLocation={onClickLocation}
                      key={index}
                      day={item}
                      onClick={clickDayHandler}
                      clickedDay={
                        isCardChanged && isFetched
                          ? layoutDays.days[0]
                          : clickedDay
                      }
                    />
                  );
                })
              : null}
          </div>
          <div className="Chart">
            <LineChart
              isLoading={isLoading}
              forecast={forecast}
              onClickLocation={onClickLocation}
              convertTempUnit={convertTempUnit}
              clickedDay={
                isCardChanged && isFetched ? layoutDays.days[0] : clickedDay
              }
              isCardChanged={isCardChanged}
            />
          </div>
        </Fragment>
      ) : null}
      {onClickLocation === '' && !errorHttp ? layoutEmpty : ''}
      {errorHttp && layoutError}
    </div>
  );
};

export default Chart5Days;
