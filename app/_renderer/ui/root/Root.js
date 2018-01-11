import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { ConnectedRouter } from 'react-router-redux';
import Routes from '../routes';

const Root = ({ store, history }) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>
);


Root.propTypes = {
  store: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired
};

export default Root;
