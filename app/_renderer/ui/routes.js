import React from 'react';
import { Switch, Route } from 'react-router';
import App from './root/App';
import CreateEbundle from './create/Index';

export default () => (
  <App>
    <Switch>
      <Route path="/" component={CreateEbundle} />
    </Switch>
  </App>
);
