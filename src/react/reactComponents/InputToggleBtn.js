var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import './InputToggleBtn.css';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

// label instead form since clicking on lable will chech/uncheck input
var InputToggleBtn = function InputToggleBtn() {
  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isToggle = _useState2[0],
      setIsToggle = _useState2[1];

  var dispatch = useDispatch();
  var togglerHandler = function togglerHandler() {
    setIsToggle(function (prev) {
      return !prev;
    });
  };

  // update store
  useEffect(function () {
    var dispatchObj = {
      type: 'CONVERT_TEMP',
      convert: isToggle
    };
    dispatch(dispatchObj);
  }, [isToggle]);

  return React.createElement(
    'label',
    { htmlFor: 'toggle', className: 'FormToggleBtn' },
    React.createElement('input', {
      className: 'FormToggleBtn__input',
      onChange: togglerHandler,
      id: 'toggle',
      type: 'checkbox'
    }),
    React.createElement(
      'span',
      { className: 'FormToggleBtn__slider' },
      React.createElement(
        'p',
        null,
        '\xB0' + 'F'
      )
    )
  );
};

export default InputToggleBtn;