import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound = function () {
  return (
    <section className="NotFound">
      <h1 className="NotFound__header">
        Ups<span className="NotFound__span">!</span> Page not Found
        <span className="NotFound__span">.</span>
      </h1>
      <div className="NotFound__Error">404</div>
      <Link to="/Home" className="NotFound__Link">
        Home
      </Link>
    </section>
  );
};

export default NotFound;
