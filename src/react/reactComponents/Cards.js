// Mobile : column-flex
// Desktop: row-flex

import Card from './Card';
import './Cards.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

export default function Cards(props) {
  // load data from store
  var _useSelector = useSelector(function (state) {
    return state;
  }),
      width = _useSelector.winWidth,
      query = _useSelector.query;

  // dispatch to store


  var dispatch = useDispatch();

  // if query empty use url to init cards
  var results = (query.length === 0 ? props.urlData : query).map(function (card, index) {
    return React.createElement(Card, { key: index, location: card, weather: width });
  });

  console.log(query);

  // dispatch to store the props if query is empty
  useEffect(function () {
    if (query.length === 0) dispatch({ type: 'ALL_INPUTS', arr: props.urlData });
  }, []);

  return React.createElement(
    'div',
    { className: 'Cards' },
    results
  );
}