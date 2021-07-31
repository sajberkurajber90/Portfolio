import React from 'react';

import './Card.css';

var Card = function Card(props) {
  return React.createElement(
    'div',
    { className: 'Card Card--color' },
    React.createElement(
      'p',
      null,
      props.location
    ),
    React.createElement(
      'p',
      null,
      props.deg
    ),
    React.createElement(
      'p',
      { className: 'Card__heading' },
      '20\xB0'
    )
  );
};

export default Card;

// #TODO:
// implement use-http hook
// implement card with expendable field onClick for mobile
// onClik desktop refresh bottom scren for 5 days weather forecast