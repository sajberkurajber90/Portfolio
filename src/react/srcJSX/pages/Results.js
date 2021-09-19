import React, { useEffect } from 'react';
import './Results.css';
import Cards from '../reactComponents/Cards';
import Chart5Days from '../reactComponents/Chart5Days';
import { useParams, useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import FormResults from '../reactComponents/FormResults';
import DashBoard from '../reactComponents/DashBoard';
import ModalLoadedCities from '../reactComponents/ModalLoadedCities';
import InputToggleBtn from '../reactComponents/InputToggleBtn';
import isContentSame from '../../helper/isContentSame';

const generateOrdinalIndicator = function (date) {
  const extractNumber = +date.split(' ')[1];
  if (extractNumber === 1) return 'st';
  if (extractNumber === 2) return 'nd';
  if (extractNumber === 3) return 'rd';
  if (extractNumber > 3) return 'th';
};

const Results = function () {
  const today = new Date().toLocaleDateString('en-us', {
    day: 'numeric',
    month: 'long',
  });

  const todayJsx = <span>{generateOrdinalIndicator(today)}</span>;

  // dispatch and history fun
  const dispatch = useDispatch();
  const historyHook = useHistory();
  // get the state
  const {
    input,
    winWidth: width,
    currentWeather,
    replaceHistory,
    currentUrl,
    inputSource,
    modalHidden,
    errorLocation,
    onClickLocation,
    convertTempUnit,
    forecast,
  } = useSelector(state => {
    return state;
  });
  // on refreash
  let { cities: urlData } = useParams();
  // filter url data
  urlData = urlData.split('+').filter(element => {
    return !errorLocation.includes(element);
  });
  const urlLen = urlData.length; // url form the url bar
  const urlArr = [...new Set(urlData)]; // unique values w
  const isDuplicate = urlArr.length !== urlLen; // on duplicates replace history
  const same = isContentSame(urlData, currentUrl, errorLocation); // check content of the url and store url arr
  // update url
  useEffect(() => {
    if (!same) {
      if (replaceHistory || isDuplicate) {
        console.log('REPLACING HISTORY');
        historyHook.replace(
          isDuplicate
            ? `/Home/${urlArr.join('+')}`
            : `/Home/${currentUrl.join('+')}`
        );
        dispatch({ type: 'RESET' });
      }
      if (!replaceHistory && inputSource) {
        console.log('PUSHING HISTORY');
        historyHook.push(`/Home/${currentUrl.join('+')}`);
      }
    }
  }, [currentUrl.join('+'), isDuplicate]);

  // on manual url update and refreash
  useEffect(() => {
    if (!inputSource && !replaceHistory && !same) {
      console.log('UPDATING CURRENT URL');

      dispatch({
        type: 'ALL_INPUTS',
        payload: urlArr,
        source: false,
      });
    }
  }, [urlArr.join('+'), inputSource]);

  // on manual url change unclick the clicked card - if it doesnt' exist in url
  useEffect(() => {
    if (onClickLocation !== '') {
      const isIncludedInURL = urlArr.includes(onClickLocation);
      isIncludedInURL ? null : dispatch({ type: 'ON_CARD_CLICK', payload: '' });
    }
  }, [urlArr.join('+')]);

  return (
    <section className="Results">
      <ModalLoadedCities
        currentWeather={currentWeather}
        currentUrl={currentUrl}
        isHidden={modalHidden}
      />
      <h1 className="Results__header">
        Weather for {today}
        {todayJsx}
      </h1>
      {width >= 1100 && (
        <FormResults
          input={input}
          currentWeather={currentWeather}
          width={width}
        />
      )}
      {width < 1100 && (
        <div className="Results__toggle">
          <p>Swipe a card to left to remove it</p>
          <InputToggleBtn width={width} />
        </div>
      )}
      <DashBoard>
        <Cards
          currentWeather={currentWeather}
          width={width}
          currentUrl={currentUrl}
          errorLocation={errorLocation}
          onClickLocation={onClickLocation}
          convertTempUnit={convertTempUnit}
          forecast={forecast}
        />
        {width >= 1100 ? (
          <Chart5Days
            onClickLocation={onClickLocation}
            convertTempUnit={convertTempUnit}
            forecast={forecast}
            currentUrl={currentUrl}
            width={width}
          />
        ) : null}
      </DashBoard>
      {width < 1100 && (
        <FormResults
          input={input}
          currentWeather={currentWeather}
          width={width}
        />
      )}
    </section>
  );
};

export default Results;
