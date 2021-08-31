import React from 'react';

const CloseIcon = function (props) {
  let id = props.id ? `close-${props.id}` : 'close';
  let width = props.width ? `${props.width}` : '30';
  let height = props.height ? `${props.height}` : '30';
  let opacity = props.opacity ? `${props.opacity}` : '1';
  let onClick = props.onClick ? props.onClick : () => {};
  return (
    <svg
      onClick={onClick}
      className={props.className}
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      fill="currentColor"
      viewBox="0 0 16 16"
      id={id}
      opacity={opacity}
    >
      <path d="M1.293 1.293a1 1 0 0 1 1.414 0L8 6.586l5.293-5.293a1 1 0 1 1 1.414 1.414L9.414 8l5.293 5.293a1 1 0 0 1-1.414 1.414L8 9.414l-5.293 5.293a1 1 0 0 1-1.414-1.414L6.586 8 1.293 2.707a1 1 0 0 1 0-1.414z" />
    </svg>
  );
};

export default CloseIcon;
