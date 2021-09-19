import React, { Fragment } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import Form from './reactComponents/Form';
import Home from './pages/Home';
import Results from './pages/Results';
import NotFound from './pages/NotFound';
import WindowSize from './reactComponents/WindowSize';

function App() {
  return React.createElement(
    Fragment,
    null,
    React.createElement(
      Switch,
      null,
      React.createElement(
        Route,
        { path: '/', exact: true },
        React.createElement(Redirect, { to: '/Home' })
      ),
      React.createElement(
        Route,
        { path: '/Home', exact: true },
        React.createElement(
          Home,
          null,
          React.createElement(Form, null)
        )
      ),
      React.createElement(
        Route,
        { path: '/Home/:cities' },
        React.createElement(Results, null)
      ),
      React.createElement(
        Route,
        { path: '*' },
        React.createElement(NotFound, null)
      )
    ),
    React.createElement(WindowSize, null)
  );
}

export default App;