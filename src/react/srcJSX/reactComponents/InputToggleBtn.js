import './InputToggleBtn.css';
import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

// label instead form since clicking on lable will chech/uncheck input
const InputToggleBtn = function (props) {
  // props
  const width = props.width;

  // ref - to chek the input value
  const toggleRef = useRef(null);

  // state - just used to trigger the useEffect
  const [isToggle, setIsToggle] = useState(false);
  const dispatch = useDispatch();
  const togglerHandler = function () {
    setIsToggle(prev => {
      return !prev;
    });
  };
  // update store
  useEffect(() => {
    // on device change - reset to celsius
    const isChecked = toggleRef.current.checked;
    // update the state
    const dispatchObj = {
      type: 'CONVERT_TEMP',
      convert: isChecked,
    };
    dispatch(dispatchObj);
  }, [isToggle, width]);

  return (
    <label htmlFor="toggle" className="FormToggleBtn">
      <input
        ref={toggleRef}
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
