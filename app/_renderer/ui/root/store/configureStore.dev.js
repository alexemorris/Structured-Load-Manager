import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createHashHistory } from 'history';
import { routerMiddleware, routerActions } from 'react-router-redux';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';
import * as metadataActions from '../../features/steps/metadata/duck';
import * as timelineActions from '../../features/timeline/duck';
import * as mappingActions from '../../features/steps/mapping/duck';
// import bundleDuck from '../../features/steps/bundles/duck';
import columnDuck from '../../features/steps/columns/duck';

// console.log(bundleDuck.creators);

// import * as directoryActions from '../actions/directories';
// import * as fileActions from '../actions/files';
// import * as errorActions from '../actions/error';
// import * as inputActions from '../actions/input';
// import * as bundleActions from '../actions/bundles';
// import * as columnActions from '../actions/columns';

const history = createHashHistory();

const configureStore = (initialState?: counterStateType) => {
  // Redux Configuration
  const middleware = [];
  const enhancers = [];

  // Thunk Middleware
  middleware.push(thunk);

  // Logging Middleware
  const logger = createLogger({
    level: 'info',
    collapsed: true
  });
  middleware.push(logger);

  // Router Middleware
  const router = routerMiddleware(history);
  middleware.push(router);

  // Redux DevTools Configuration
  const actionCreators = {
    ...metadataActions,
    ...timelineActions,
    ...mappingActions,
    ...routerActions,
    // ...bundleDuck.creators,
    ...columnDuck.creators
    // ...columnActions,
    // ...bundleActions,
    // ...inputActions,
    // ...fileActions,
    // ...errorActions,
    // ...directoryActions
  };
  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Options: http://zalmoxisus.github.io/redux-devtools-extension/API/Arguments.html
      actionCreators,
    })
    : compose;
  /* eslint-enable no-underscore-dangle */

  // Apply Middleware & Compose Enhancers
  enhancers.push(applyMiddleware(...middleware));
  const enhancer = composeEnhancers(...enhancers);

  // Create Store
  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
    module.hot.accept('../reducers', () =>
      store.replaceReducer(require('../reducers')) // eslint-disable-line global-require
    );
  }

  return store;
};

export default { configureStore, history };
