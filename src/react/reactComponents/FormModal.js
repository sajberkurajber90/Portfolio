import { useHistory } from 'react-router-dom';
import Button from './Button';
import './FormModal.css';
import InputCheckBox from './InputCheckBox';

var FormModal = function FormModal(props) {
  // props
  var currentWeather = props.currentWeather;
  var currentUrl = props.currentUrl;
  var removeModalHandler = props.removeModalHandler;

  var historyHook = useHistory();

  // filter for non displayed cities
  var notDisplayed = currentWeather.filter(function (city) {
    return !currentUrl.includes(city.name);
  });

  var checkBox = notDisplayed.map(function (city, index) {
    return React.createElement(InputCheckBox, {
      key: index,
      id: index,
      city: city.name,
      currentUrl: currentUrl
    });
  });

  var onSubmitionHandler = function onSubmitionHandler(event) {
    event.preventDefault();
    // transform NodeList of checked cities to array
    var values = Array.from(document.querySelector('.FormModal').querySelectorAll('input[type=checkbox]:checked')).map(function (element) {
      return element.value;
    });
    // update history based on checked cities
    if (values.length !== 0) {
      historyHook.push('/Home/' + currentUrl.join('+') + '+' + values.join('+'));
    }
    // close modal on submition
    removeModalHandler();
  };

  return React.createElement(
    'form',
    { onSubmit: onSubmitionHandler, className: 'FormModal' },
    React.createElement(
      'div',
      { className: 'FormModal__Inputs' },
      checkBox.length === 0 ? React.createElement(
        'h2',
        { className: 'FormModal__msg' },
        'All fethced cities are displayed'
      ) : checkBox
    ),
    React.createElement(Button, { label: 'Submit', className: 'FormModal__btn' })
  );
};

export default FormModal;