import './RemoveCardMobile.css';
import CloseIcon from './CloseIcon';
import { useEffect } from 'react';

const RemoveCardMobile = function (props) {
  // props
  const width = props.width;
  const opacity = width > -25 ? '0' : '1';
  const isCardInPos = props.isCardInPos;
  const setIsCardInPos = props.setIsCardInPos;
  const removeCardHandler = props.removeCardHandler;

  const style = {
    width: `${-width}px`,
    transition: isCardInPos ? 'none' : 'width 0.2s',
  };

  // stop the animation when border or start position is reached
  useEffect(() => {
    let clear;
    if (!isCardInPos) {
      clear = setTimeout(() => {
        setIsCardInPos();
      }, 300);
    }
    return () => {
      clear ? clearTimeout(clear) : '';
    };
  }, [isCardInPos]);

  return (
    <div onClick={removeCardHandler} style={style} className="RemoveCardMobile">
      <CloseIcon
        opacity={opacity}
        width={20}
        height={20}
        className={'RemoveCardMobile__Icon'}
      />
    </div>
  );
};

export default RemoveCardMobile;
