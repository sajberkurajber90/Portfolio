import React from 'react';
import './Home.css';

var Home = function Home(props) {
  return React.createElement(
    'section',
    { className: 'Home' },
    props.children
  );
};

export default Home;