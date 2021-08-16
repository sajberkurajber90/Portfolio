import React, { useEffect } from 'react';
import './Results.css';
import Cards from '../reactComponents/Cards';
import Chart5Days from '../reactComponents/Chart5Days';
import { useParams, useHistory } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import FormResults from '../reactComponents/FormResults';
import DashBoard from '../reactComponents/DashBoard';
import ModalLoadedCities from '../reactComponents/ModalLoadedCities';

const Results = function () {
  const today = new Date().toLocaleDateString('en-us', {
    day: 'numeric',
    month: 'long',
  });
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
  } = useSelector(state => {
    return state;
  });

  // on refreash
  const { citys: urlData } = useParams();
  const urlLen = urlData.split('+').length; // url form the url bar
  const urlArr = [...new Set(urlData.split('+'))]; // unique values
  const isDuplicate = urlArr.length !== urlLen; // on duplicates replace history
  // update url
  useEffect(() => {
    if (replaceHistory || isDuplicate) {
      console.log('REPLACING HISTORY');
      historyHook.replace(
        isDuplicate
          ? `/Home/${urlArr.join('+')}`
          : `/Home/${currentUrl.join('+')}`
      );
    }
    if (!replaceHistory && inputSource) {
      console.log('PUSHING HISTORY');
      historyHook.push(`/Home/${currentUrl.join('+')}`);
    }
  }, [currentUrl.join('+'), isDuplicate]);

  // on manual url update and refreash
  useEffect(() => {
    if (!inputSource) {
      console.log('UPDATING CURRENT URL');

      dispatch({
        type: 'ALL_INPUTS',
        payload: urlArr,
        source: false,
      });
    }
  }, [urlArr.join('+'), inputSource]);

  return (
    <section className="Results">
      <ModalLoadedCities
        currentWeather={currentWeather}
        currentUrl={currentUrl}
        isHidden={modalHidden}
      />
      <h1 className="Results__header">Current Weather for {today}</h1>
      {width > 1100 && (
        <FormResults
          input={input}
          currentWeather={currentWeather}
          width={width}
        />
      )}
      <DashBoard>
        <Cards
          currentWeather={currentWeather}
          width={width}
          currentUrl={currentUrl}
        />
        <Chart5Days />
      </DashBoard>
      {width <= 1100 && (
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
