import './Chart5DaysMobile.css';
import { useRef, useEffect, useState, Fragment } from 'react';
import BarChart from './BarChart';
import useHttp from '../hooks/use-http';
import { useDispatch } from 'react-redux';
import parseForecast from '../../helper/parseForecast';
import { get5DaysForecast } from '../../helper/urls';

const daysLong = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday',
};

const Chart5DaysMobile = function (props) {
  // props
  const convertTempUnit = props.convertTempUnit;
  const forecast = props.forecast;
  const tappedCity = props.tappedCity;
  const onErrorUntapHandler = props.onErrorUntapHandler;
  const runAnimCloseChart = props.runAnimCloseChart;
  // state - forecast day tapepd
  const [tappedDayIndex, setTappedDayIndex] = useState(0);
  // tooltip for weather description on bar tap
  const [toolTip, setToolTip] = useState(null);
  const toolTipHandler = function (description) {
    setToolTip(description);
  };

  //  custom http-hook
  const { isLoading, error: errorHttp, sendRequest, errorHandler } = useHttp();
  // is mounted ref
  const isMountedRef = useRef(null);
  // dispatch
  const dispatch = useDispatch();
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
        .includes(tappedCity)
    : false;
  // days array
  const [weather] = isFetched
    ? forecast.filter(item => {
        return item.name === tappedCity;
      })
    : [false];
  // forecasst days
  const days = weather ? [...weather.days] : false;

  // tapping on a forecast day
  const onTapDayNextIndexHandler = function () {
    days
      ? setTappedDayIndex(prev => {
          console.log(prev);
          return tappedDayIndex < days.length - 1 ? prev + 1 : prev;
        })
      : null;
  };
  const onTapDayPreviousIndexHandler = function () {
    days
      ? setTappedDayIndex(prev => {
          return tappedDayIndex === 0 ? prev : prev - 1;
        })
      : null;
  };

  // fetch
  useEffect(() => {
    isMountedRef.current = true;
    if (isFetched || errorHttp) {
      console.log('Loading Chart or Error');
    } else {
      const locationUrl = get5DaysForecast(tappedCity);
      sendRequest(locationUrl, dataTransform, isMountedRef);
    }
    return () => {
      isMountedRef.current = false;
    };
  }, [isFetched]);

  // handling errors
  useEffect(() => {
    let clear;
    if (errorHttp) {
      clear = setTimeout(() => {
        // remove error
        errorHandler();
        // untap on error and activate closing anim
        onErrorUntapHandler();
      }, 2000);
    }
    return () => {
      clear ? clearTimeout(clear) : '';
    };
  }, [errorHandler, errorHttp]);

  // reset the weather description on both day and unit change
  useEffect(() => {
    setToolTip(prev => {
      if (prev) {
        return null;
      }
    });
  }, [tappedDayIndex]);

  // layout
  const layout = errorHttp ? (
    <p className="Chart5DaysMobile__error">Something went wrong try latter</p>
  ) : isFetched || isLoading ? (
    <Fragment>
      <div
        className="Chart5DaysMobile__toolTip "
        style={{ opacity: `${toolTip ? 1 : 0}` }}
        onClick={toolTipHandler.bind(null, null)}
      >
        {toolTip}
      </div>
      <BarChart
        isLoading={isLoading}
        convertTempUnit={convertTempUnit}
        tappedDay={days ? days[tappedDayIndex] : 0}
        forecast={forecast}
        tappedCity={tappedCity}
        toolTipHandler={toolTipHandler}
      />
    </Fragment>
  ) : null;

  const animClass = !runAnimCloseChart
    ? 'Chart5DaysMobile__Enter'
    : 'Chart5DaysMobile__Exit';

  return (
    <div className={`Chart5DaysMobile ${animClass}`}>
      {!errorHttp && isFetched ? (
        <div className="Chart5DaysMobile__header">
          <div
            className="Chart5DaysMobile__navigation"
            onClick={onTapDayPreviousIndexHandler}
          >
            {days && tappedDayIndex > 0 && days[tappedDayIndex - 1]}
          </div>
          <div>{days ? daysLong[days[tappedDayIndex]] : null}</div>
          <div
            className="Chart5DaysMobile__navigation"
            onClick={onTapDayNextIndexHandler}
          >
            {days && tappedDayIndex < days.length && days[tappedDayIndex + 1]}
          </div>
        </div>
      ) : null}
      <div className="Chart5DaysMobile__Chart">{layout}</div>
    </div>
  );
};

export default Chart5DaysMobile;
