import React, { Fragment } from 'react';

import { Redirect, Route, Switch } from 'react-router-dom';

import Form from './reactComponents/Form';
import Home from './pages/Home';
import Results from './pages/Results';
import NotFound from './pages/NotFound';
import WindowSize from './reactComponents/WindowSize';

function App() {
  return (
    <Fragment>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/Home" />
        </Route>
        <Route path="/Home" exact>
          <Home>
            <Form />
          </Home>
        </Route>
        <Route path="/Home/:cities">
          <Results />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
      <WindowSize />
    </Fragment>
  );
}

export default App;
