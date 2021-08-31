// Mobile : column-flex
// Desktop: row-flex

import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import Card from './Card';
import './Cards.css';

export default function Cards(props) {
  // props decomposition
  const width = props.width;
  const currentWeather = props.currentWeather;
  const currentUrl = props.currentUrl;
  const errorLocation = props.errorLocation;
  const onClickLocation = props.onClickLocation;
  const convertTempUnit = props.convertTempUnit;
  // dispatch
  const dispatch = useDispatch();
  const isMountedRef = useRef(null);

  // clear error arr
  useEffect(() => {
    isMountedRef.current = true;
    if (errorLocation.length) {
      isMountedRef.current
        ? dispatch({
            type: 'ERROR',
            clear: true,
            replaceHistory: false,
          })
        : '';
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [errorLocation.length]);

  let results;
  currentUrl.length === 0
    ? (results = null)
    : (results = currentUrl.map((item, index) => {
        return (
          <Card
            id={`Card-${item}`}
            key={index}
            city={item}
            delay={index}
            currentWeather={currentWeather}
            errorLocation={errorLocation}
            currentUrl={currentUrl}
            width={width}
            onClickLocation={onClickLocation}
            convertTempUnit={convertTempUnit}
          />
        );
      }));

  return <div className="Cards">{results}</div>;
}
