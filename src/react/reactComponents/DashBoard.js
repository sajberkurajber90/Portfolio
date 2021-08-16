import './Dashboard.css';

var DashBoard = function DashBoard(props) {
  return React.createElement(
    'div',
    { className: 'DashBoard' },
    ' ',
    props.children,
    ' '
  );
};

export default DashBoard;