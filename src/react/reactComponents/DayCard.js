var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import './DayCard.css';
import { useEffect, useState } from 'react';
var DayCard = function DayCard(props) {
  // props
  var day = props.day;
  var clickDayHandler = props.onClick;
  var clickedDay = props.clickedDay;
  var onClickLocation = props.onClickLocation;

  // disableClikcFlag during init animation

  var _useState = useState(true),
      _useState2 = _slicedToArray(_useState, 2),
      disableClick = _useState2[0],
      setDisableClick = _useState2[1];

  useEffect(function () {
    var clear = void 0;
    !disableClick ? setDisableClick(true) : null;
    clear = setTimeout(function () {
      setDisableClick(false); // restart on animation end
    }, 500);

    return function () {
      console.log('CLEAR - CLIKC');
      clearTimeout(clear);
    };
  }, [onClickLocation]);

  console.log('DISABLE CLICK: ', disableClick);

  var styleObj = {
    backgroundColor: clickedDay === day ? '#5d536c' : '#685d79',
    cursor: disableClick ? 'not-allowed' : 'pointer'
  };

  return React.createElement(
    'div',
    {
      onClick: !disableClick ? clickDayHandler.bind(null, day) : function (event) {
        return event.preventDefault();
      },
      style: styleObj,
      className: 'DayCard'
    },
    day
  );
};

export default DayCard;