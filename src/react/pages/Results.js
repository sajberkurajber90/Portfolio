import React from 'react';
import './Results.css';
import Cards from '../reactComponents/Cards';
import Chart5Days from '../reactComponents/Chart5Days';
import Button from '../reactComponents/Button';
import { useParams } from 'react-router';

// TODO: add event handler to btn

var Results = function Results() {
  var today = new Date().toLocaleDateString('en-us', {
    day: 'numeric',
    month: 'long'
  });

  // if page reloaded on results

  var _useParams = useParams(),
      urlData = _useParams.citys;

  var urlArr = urlData.split('+');

  return React.createElement(
    'section',
    { className: 'Results' },
    React.createElement(
      'h1',
      { className: 'Results__header' },
      'Current Weather for ',
      today
    ),
    React.createElement(Cards, { urlData: urlArr }),
    React.createElement(Chart5Days, null),
    React.createElement(Button, { className: 'Results__button', label: 'Add City' })
  );
};

export default Results;