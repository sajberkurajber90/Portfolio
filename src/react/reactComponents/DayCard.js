import './DayCard.css';

var DayCard = function DayCard(props) {
  // props
  var day = props.day;
  var clickDayHandler = props.onClick;
  var clickedDay = props.clickedDay;

  var styleObj = clickedDay === day ? { backgroundColor: '#5d536c' } : {};

  return React.createElement(
    'div',
    {
      onClick: clickDayHandler.bind(null, day),
      style: styleObj,
      className: 'DayCard'
    },
    day
  );
};

export default DayCard;