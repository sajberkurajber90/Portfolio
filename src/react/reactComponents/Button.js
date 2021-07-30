var Button = function Button(props) {
  return React.createElement(
    "button",
    { onClick: props.onClick, className: props.className },
    props.label
  );
};

export default Button;