import './RemoveCardMobile.css';
import CloseIcon from './CloseIcon';
import { useEffect } from 'react';

var RemoveCardMobile = function RemoveCardMobile(props) {
  // props
  var width = props.width;
  var opacity = width > -25 ? '0' : '1';
  var isCardInPos = props.isCardInPos;
  var setIsCardInPos = props.setIsCardInPos;
  var removeCardHandler = props.removeCardHandler;

  var style = {
    width: -width + 'px',
    transition: isCardInPos ? 'none' : 'width 0.2s'
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