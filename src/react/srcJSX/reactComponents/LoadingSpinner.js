import './LoadingSpinner.css';
const LoadingSpinner = function (props) {
  const className = props.className;
  const marginTop = props.marginTop;

  return (
    <div style={{ marginTop: `${marginTop}rem` }} className={className}></div>
  );
};

export default LoadingSpinner;
