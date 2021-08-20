import './LoadingSpinner.css';
var LoadingSpinner = function LoadingSpinner(props) {
  var className = props.className;
  var marginTop = props.marginTop;

  return React.createElement('div', { style: { marginTop: marginTop + 'rem' }, className: className });
};

export default LoadingSpinner;