import './DayCard.css';
import { useEffect, useState } from 'react';
const DayCard = function (props) {
  // props
  const day = props.day;
  const clickDayHandler = props.onClick;
  const clickedDay = props.clickedDay;
  const onClickLocation = props.onClickLocation;

  // disableClikcFlag during init animation
  const [disableClick, setDisableClick] = useState(true);

  useEffect(() => {
    let clear;
    !disableClick ? setDisableClick(true) : null;
    clear = setTimeout(() => {
      setDisableClick(false); // restart on animation end
    }, 500);

    return () => {
      console.log('CLEAR - CLIKC');
      clearTimeout(clear);
    };
  }, [onClickLocation]);

  console.log('DISABLE CLICK: ', disableClick);

  const styleObj = {
    backgroundColor: clickedDay === day ? '#5d536c' : '#685d79',
    cursor: disableClick ? 'not-allowed' : 'pointer',
  };

  return (
    <div
      onClick={
        !disableClick
          ? clickDayHandler.bind(null, day)
          : event => event.preventDefault()
      }
      style={styleObj}
      className="DayCard"
    >
      {day}
    </div>
  );
};

export default DayCard;
