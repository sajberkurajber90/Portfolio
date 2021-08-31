import './RemoveCardMobile.css';
import CloseIcon from './CloseIcon';
import { useHistory } from 'react-router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

const RemoveCardMobile = function (props) {
  // props
  const width = props.width;
  const opacity = width > -25 ? '0' : '1';
  const isCardInPos = props.isCardInPos;
  const setIsCardInPos = props.setIsCardInPos;
  const currentUrl = props.currentUrl;
  const city = props.city;

  const style = {
    width: `${-width}px`,
    transition: isCardInPos ? 'none' : 'width 0.2s',
  };

  // historyHook
  const historyHook = useHistory();
  // dispatch Hook
  const dispatch = useDispatch();

  const removeCardHandler = function () {
    // useHistory push
    const newUrl = currentUrl.filter(item => {
      return item !== city;
    });
    if (newUrl.length) {
      console.log('HISTORY PUSH');
      historyHook.push(`/Home/${newUrl.join('+')}`);
    } else {
      console.log('DISPATCH');
      const dispatchObj = { type: 'ALL_INPUTS', payload: [], source: true };
      dispatch(dispatchObj);
    }
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
