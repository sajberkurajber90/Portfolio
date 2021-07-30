import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

var NotFound = function NotFound() {
  return React.createElement(
    'section',
    { className: 'NotFound' },
    React.createElement(
      'h1',
      { className: 'NotFound__header' },
      'Ups',
      React.createElement(
        'span',
        { className: 'NotFound__span' },
        '!'
      ),
      ' Page not Found',
      React.createElement(
        'span',
        { className: 'NotFound__span' },
        '.'
      )
    ),
    React.createElement(
      'div',
      { className: 'NotFound__Error' },
      '404'
    ),
    React.createElement(
      Link,
      { to: '/Home', className: 'NotFound__Link' },
      'Home'
    )
  );
};

export default NotFound;