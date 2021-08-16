// Mobile : column-flex
// Desktop: row-flex

import Card from './Card';
import './Cards.css';

export default function Cards(props) {
  // props decomposition
  var width = props.width;
  var currentWeather = props.currentWeather;
  var currentUrl = props.currentUrl;

  var results = void 0;
  currentUrl.length === 0 ? results = null : results = currentUrl.map(function (item, index) {
    return React.createElement(Card, {
      key: index,
      city: item,
      delay: index,
      currentWeather: currentWeather
    });
  });

  return React.createElement(
    'div',
    { className: 'Cards' },
    ' ',
    results
  );
}