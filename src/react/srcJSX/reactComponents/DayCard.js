import './DayCard.css';

const DayCard = function (props) {
  // props
  const day = props.day;
  const clickDayHandler = props.onClick;
  const clickedDay = props.clickedDay;

  const styleObj = clickedDay === day ? { backgroundColor: '#5d536c' } : {};

  return (
    <div
      onClick={clickDayHandler.bind(null, day)}
      style={styleObj}
      className="DayCard"
    >
      {day}
    </div>
  );
};

export default DayCard;
