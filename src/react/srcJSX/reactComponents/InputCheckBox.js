import { useEffect, useState } from 'react';
import './InputCheckBox.css';
import CheckBoxIcon from './CheckBoxIcon';
const InputCheckBox = function (props) {
  // props
  const id = props.id;
  const city = props.city;
  const currentUrl = props.currentUrl;

  const [isChecked, setIsChecked] = useState(false);
  const checkedHandler = function () {
    setIsChecked(prev => {
      return !prev;
    });
  };

  console.log(`isChecked ${city}`, isChecked);

  // on successful submition clear the checkboxes
  useEffect(() => {
    setIsChecked(false);
  }, [currentUrl.join('+')]);

  return (
    <div className="InputCheckBox">
      <div className={'InputCheckBox-custom'}>
        <input
          type="checkbox"
          id={id}
          value={city}
          checked={isChecked}
          onChange={checkedHandler}
        />
        {isChecked ? (
          <CheckBoxIcon
            className={'InputCheckBox-svg'}
            onClick={checkedHandler}
          />
        ) : null}
      </div>
      <label onClick={checkedHandler} className="InputCheckBox__label">
        {city}
      </label>
    </div>
  );
};

export default InputCheckBox;
