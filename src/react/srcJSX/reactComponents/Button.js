const Button = function (props) {
  return (
    <button onClick={props.onClick} className={props.className}>
      {props.label}
    </button>
  );
};

export default Button;
