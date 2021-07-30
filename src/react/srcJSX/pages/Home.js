import React from 'react';
import './Home.css';

const Home = function (props) {
  return <section className="Home">{props.children}</section>;
};

export default Home;
