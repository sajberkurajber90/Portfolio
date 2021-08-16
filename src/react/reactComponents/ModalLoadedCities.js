import './ModalLoadedCities.css';
import CloseIcon from './CloseIcon';
import FormModal from './FormModal';
import { useDispatch } from 'react-redux';

var ModalLoadedCities = function ModalLoadedCities(props) {
  // props
  var currentWeather = props.currentWeather;
  var currentUrl = props.currentUrl;
  var isHidden = props.isHidden;

  var dispatch = useDispatch();
  // close btn handler
  var onCloseHandler = function onCloseHandler() {
    dispatch({ type: 'MODAL', payload: true });
  };

  // click on backdrop handler
  var onClickBackDropHandler = function onClickBackDropHandler(event) {
    if (event.target.classList[0] === 'ModalLoadedCities') {
      dispatch({ type: 'MODAL', payload: true });
    }
  };

  return React.createElement(
    'div',
    {
      onClick: onClickBackDropHandler,
      className: 'ModalLoadedCities ' + (isHidden ? 'ModalLoadedCities--hidden' : '')
    },
    React.createElement(
      'div',
      { className: 'Modal' },
      React.createElement(CloseIcon, { className: 'Modal__close', onClick: onCloseHandler }),
      React.createElement(
        'h1',
        { className: 'Modal__header' },
        'Loaded Cities'
      ),
      React.createElement(FormModal, { currentUrl: currentUrl, currentWeather: currentWeather })
    )
  );
};

export default ModalLoadedCities;