var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import './ModalLoadedCities.css';
import CloseIcon from './CloseIcon';
import FormModal from './FormModal';
import { useDispatch } from 'react-redux';
import CSSTransition from 'react-transition-group/CSSTransition';
import { useState, useEffect } from 'react';

// transition style obj - cards
var transitionStyles = {
  exitActive: 'ModalLoadedCities__Exit'
};

// animation timing obj
var animationTiming = { exit: 1000 };

var ModalLoadedCities = function ModalLoadedCities(props) {
  // props
  var currentWeather = props.currentWeather;
  var currentUrl = props.currentUrl;
  var isHidden = props.isHidden;

  // state for animation control

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isToRemove = _useState2[0],
      setIsToRemove = _useState2[1];

  var removeModalHandler = function removeModalHandler() {
    setIsToRemove(true);
  };

  var dispatch = useDispatch();
  // close btn handler
  var onCloseHandler = function onCloseHandler() {
    setIsToRemove(true);
  };

  // click on backdrop handler
  var onClickBackDropHandler = function onClickBackDropHandler(event) {
    if (event.target.classList[0] === 'ModalLoadedCities') {
      setIsToRemove(true);
    }
  };

  var onEscKeyDownHandler = function onEscKeyDownHandler(event) {
    event.key === 'Escape' ? setIsToRemove(true) : null;
  };

  // reset animation controll
  useEffect(function () {
    if (isToRemove && isHidden) {
      setIsToRemove(false);
    }
  }, [isToRemove, isHidden]);

  // add key event listener
  useEffect(function () {
    document.addEventListener('keydown', onEscKeyDownHandler);

    return function () {
      document.removeEventListener('keydown', onEscKeyDownHandler);
    };
  }, []);

  return !isHidden ? React.createElement(
    CSSTransition,
    {
      'in': !isToRemove,
      timeout: animationTiming,
      classNames: transitionStyles,
      onExited: function onExited() {
        dispatch({ type: 'MODAL', payload: true });
      }
    },
    React.createElement(
      'div',
      { onClick: onClickBackDropHandler, className: 'ModalLoadedCities' },
      React.createElement(
        'div',
        { className: 'Modal ' + (isToRemove ? 'Modal__Exit' : '') },
        React.createElement(CloseIcon, { className: 'Modal__close', onClick: onCloseHandler }),
        React.createElement(
          'h1',
          { className: 'Modal__header' },
          'Loaded Cities'
        ),
        !isToRemove && React.createElement(FormModal, {
          currentUrl: currentUrl,
          currentWeather: currentWeather,
          removeModalHandler: removeModalHandler
        })
      )
    )
  ) : null;
};

export default ModalLoadedCities;