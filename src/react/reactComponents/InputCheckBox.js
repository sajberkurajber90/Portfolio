var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

import { useEffect, useState } from 'react';
import './InputCheckBox.css';
import CheckBoxIcon from './CheckBoxIcon';
var InputCheckBox = function InputCheckBox(props) {
  // props
  var id = props.id;
  var city = props.city;
  var currentUrl = props.currentUrl;

  var _useState = useState(false),
      _useState2 = _slicedToArray(_useState, 2),
      isChecked = _useState2[0],
      setIsChecked = _useState2[1];

  var checkedHandler = function checkedHandler() {
    setIsChecked(function (prev) {
      console.log('setChange', prev);
      return !prev;
    });
  };

  console.log('isChecked ' + city, isChecked);

  // on successful submition clear the checkboxes
  useEffect(function () {
    setIsChecked(false);
  }, [currentUrl.join('+')]);

  return React.createElement(
    'div',
    { className: 'InputCheckBox' },
    React.createElement(
      'div',
      { className: 'InputCheckBox-custom' },
      React.createElement('input', {
        type: 'checkbox',
        id: id,
        value: city,
        checked: isChecked,
        onChange: checkedHandler
      }),
      isChecked ? React.createElement(CheckBoxIcon, {
        className: 'InputCheckBox-svg',
        onClick: checkedHandler
      }) : null
    ),
    React.createElement(
      'label',
      { onClick: checkedHandler, className: 'InputCheckBox__label' },
      city
    )
  );
};

export default InputCheckBox;