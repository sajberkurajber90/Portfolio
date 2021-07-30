// Mobile : column-flex
// Desktop: row-flex

import Card from './Card';
import './Cards.css';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

export default function Cards(props) {
  // load data from store
  const { winWidth: width, query } = useSelector(state => {
    return state;
  });

  // dispatch to store
  const dispatch = useDispatch();

  // if query empty use url to init cards
  const results = (query.length === 0 ? props.urlData : query).map(
    (card, index) => {
      return <Card key={index} location={card} weather={width} />;
    }
  );

  console.log(query);

  // dispatch to store the props if query is empty
  useEffect(() => {
    if (query.length === 0)
      dispatch({ type: 'ALL_INPUTS', arr: props.urlData });
  }, []);

  return <div className="Cards">{results}</div>;
}
