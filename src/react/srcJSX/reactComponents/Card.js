import React from 'react';

import './Card.css';

const Card = function (props) {
  return (
    <div className="Card Card--color">
      <p>{props.location}</p>
      <p>{props.deg}</p>
      <p className="Card__heading">20&deg;</p>
    </div>
  );
};

export default Card;

// #TODO:
// implement use-http hook
// implement card with expendable field onClick for mobile
// onClik desktop refresh bottom scren for 5 days weather forecast
