import './ModalLoadedCities.css';
import CloseIcon from './CloseIcon';
import FormModal from './FormModal';
import { useDispatch } from 'react-redux';
import CSSTransition from 'react-transition-group/CSSTransition';
import { useState, useEffect } from 'react';

// transition style obj - cards
const transitionStyles = {
  exitActive: 'ModalLoadedCities__Exit',
};

// animation timing obj
const animationTiming = { exit: 1000 };

const ModalLoadedCities = function ModalLoadedCities(props) {
  // props
  const currentWeather = props.currentWeather;
  const currentUrl = props.currentUrl;
  const isHidden = props.isHidden;

  // state for animation control
  const [isToRemove, setIsToRemove] = useState(false);
  const removeModalHandler = function () {
    setIsToRemove(true);
  };

  const dispatch = useDispatch();
  // close btn handler
  const onCloseHandler = function onCloseHandler() {
    setIsToRemove(true);
  };

  // click on backdrop handler
  const onClickBackDropHandler = function onClickBackDropHandler(event) {
    if (event.target.classList[0] === 'ModalLoadedCities') {
      setIsToRemove(true);
    }
  };

  const onEscKeyDownHandler = function (event) {
    event.key === 'Escape' ? setIsToRemove(true) : null;
  };

  // reset animation controll
  useEffect(() => {
    if (isToRemove && isHidden) {
      setIsToRemove(false);
    }
  }, [isToRemove, isHidden]);

  // add key event listener
  useEffect(() => {
    document.addEventListener('keydown', onEscKeyDownHandler);

    return () => {
      document.removeEventListener('keydown', onEscKeyDownHandler);
    };
  }, []);

  return !isHidden ? (
    <CSSTransition
      in={!isToRemove}
      timeout={animationTiming}
      classNames={transitionStyles}
      onExited={() => {
        dispatch({ type: 'MODAL', payload: true });
      }}
    >
      <div onClick={onClickBackDropHandler} className={'ModalLoadedCities'}>
        <div className={`Modal ${isToRemove ? 'Modal__Exit' : ''}`}>
          <CloseIcon className="Modal__close" onClick={onCloseHandler} />
          <h1 className="Modal__header">Loaded Cities</h1>
          {!isToRemove && (
            <FormModal
              currentUrl={currentUrl}
              currentWeather={currentWeather}
              removeModalHandler={removeModalHandler}
            />
          )}
        </div>
      </div>
    </CSSTransition>
  ) : null;
};

export default ModalLoadedCities;
