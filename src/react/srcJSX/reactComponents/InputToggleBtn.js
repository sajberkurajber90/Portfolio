import './InputToggleBtn.css';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// label instead form since clicking on lable will chech/uncheck input
const InputToggleBtn = function () {
  const [isToggle, setIsToggle] = useState(false);
  const dispatch = useDispatch();
  const togglerHandler = function () {
    setIsToggle(prev => {
      return !prev;
    });
  };

  // update store
  useEffect(() => {
    const dispatchObj = {
      type: 'CONVERT_TEMP',
      convert: isToggle,
    };
    dispatch(dispatchObj);
  }, [isToggle]);

  return (
    <label htmlFor="toggle" className="FormToggleBtn">
      <input
        className="FormToggleBtn__input"
        onChange={togglerHandler}
        id={'toggle'}
        type="checkbox"
      />
      <span className="FormToggleBtn__slider">
        <p>{'\u00b0' + 'F'}</p>
      </span>
    </label>
  );
};

export default InputToggleBtn;
