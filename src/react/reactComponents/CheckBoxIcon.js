var CheckBoxIcon = function CheckBoxIcon(props) {
  // props
  var className = props.className;
  var onClick = props.onClick;

  return React.createElement(
    "svg",
    {
      className: className,
      onClick: onClick,
      version: "1.1",
      viewBox: "0 0 30 30"
      //   width="30"
      //   height="30"
    },
    React.createElement("path", { d: "M24,4H6C4.895,4,4,4.895,4,6v18c0,1.105,0.895,2,2,2h18c1.105,0,2-0.895,2-2V6C26,4.895,25.104,4,24,4z M21.707,11.707  l-7.56,7.56c-0.188,0.188-0.442,0.293-0.707,0.293s-0.52-0.105-0.707-0.293l-3.453-3.453c-0.391-0.391-0.391-1.023,0-1.414  s1.023-0.391,1.414,0l2.746,2.746l6.853-6.853c0.391-0.391,1.023-0.391,1.414,0S22.098,11.316,21.707,11.707z" })
  );
};

export default CheckBoxIcon;