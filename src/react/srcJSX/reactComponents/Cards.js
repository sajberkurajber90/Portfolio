// Mobile : column-flex
// Desktop: row-flex

import Card from './Card';
import './Cards.css';

export default function Cards(props) {
  // props decomposition
  const width = props.width;
  const currentWeather = props.currentWeather;
  const currentUrl = props.currentUrl;

  let results;
  currentUrl.length === 0
    ? (results = null)
    : (results = currentUrl.map((item, index) => {
        return (
          <Card
            key={index}
            city={item}
            delay={index}
            currentWeather={currentWeather}
          />
        );
      }));

  return <div className="Cards"> {results}</div>;
}
