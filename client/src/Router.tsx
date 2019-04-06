import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { AlicePage } from './AlicePage';
import { BobPage } from './BobPage';
import { EditorPage } from './EditorPage';
import { HomePage } from './HomePage';

const Router = () => {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/editor" component={EditorPage} />
      <Route path="/alice-enrico" component={AlicePage} />
      <Route path="/bob" component={BobPage} />
      <Redirect from="*" to="/" />
    </Switch>
  );
};

export default Router;
