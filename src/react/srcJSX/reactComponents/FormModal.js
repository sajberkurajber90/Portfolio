import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from './Button';
import './FormModal.css';
import InputCheckBox from './InputCheckBox';

const FormModal = function (props) {
  const currentWeather = props.currentWeather;
  const currentUrl = props.currentUrl;

  const historyHook = useHistory();
  const dispatch = useDispatch();

  // filter for non displayed cities
  const notDisplayed = currentWeather.filter(city => {
    return !currentUrl.includes(city.name);
  });

  const checkBox = notDisplayed.map((city, index) => {
    return (
      <InputCheckBox
        key={index}
        id={index}
        city={city.name}
        currentUrl={currentUrl}
      />
    );
  });

  const onSubmitionHandler = function (event) {
    event.preventDefault();
    // transform NodeList of checked cities to array
    const values = Array.from(
      document
        .querySelector('.FormModal')
        .querySelectorAll('input[type=checkbox]:checked')
    ).map(element => {
      return element.value;
    });
    // update history based on checked cities
    if (values.length !== 0) {
      historyHook.push(`/Home/${currentUrl.join('+')}+${values.join('+')}`);
    }
    // close modal on submition
    dispatch({ type: 'MODAL', payload: true });
  };

  return (
    <form onSubmit={onSubmitionHandler} className={'FormModal'}>
      <div className={'FormModal__Inputs'}>
        {checkBox.length === 0 ? (
          <h2 className="FormModal__msg">All fathced cities are displayed</h2>
        ) : (
          checkBox
        )}
      </div>
      <Button label={'Submit'} className="FormModal__btn" />
    </form>
  );
};

export default FormModal;
