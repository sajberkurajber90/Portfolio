import './RemoveCardMobile.css';
import CloseIcon from './CloseIcon';
import { useHistory } from 'react-router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

var RemoveCardMobile = function RemoveCardMobile(props) {
  // props
  var width = props.width;
  var opacity = width > -25 ? '0' : '1';
  var isCardInPos = props.isCardInPos;
  var setIsCardInPos = props.setIsCardInPos;
  var currentUrl = props.currentUrl;
  var city = props.city;

  var style = {
    width: -width + 'px',
    transition: isCardInPos ? 'none' : 'width 0.2s'
  };

  // historyHook
  var historyHook = useHistory();
  // dispatch Hook
  var dispatch = useDispatch();

  var removeCardHandler = function removeCardHandler() {
    // useHistory push
    var newUrl = currentUrl.filter(function (item) {
      return item !== city;
    });
    if (newUrl.length) {
      console.log('HISTORY PUSH');
      historyHook.push('/Home/' + newUrl.join('+'));
    } else {
      console.log('DISPATCH');
      var dispatchObj = { type: 'ALL_INPUTS', payload: [], source: true };
      dispatch(dispatchObj);
    }
  };

  // stop the animation when border or start position is reached
  useEffect(function () {
    var clear = void 0;
    if (!isCardInPos) {
      clear = setTimeout(function () {
        setIsCardInPos();
      }, 300);
    }
    return function () {
      clear ? clearTimeout(clear) : '';
    };
  }, [isCardInPos]);

  return React.createElement(
    'div',
    { onClick: removeCardHandler, style: style, className: 'RemoveCardMobile' },
    React.createElement(CloseIcon, {
      opacity: opacity,
      width: 20,
      height: 20,
      className: 'RemoveCardMobile__Icon'
    })
  );
};

export default RemoveCardMobile;