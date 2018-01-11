import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { ipcRenderer } from 'electron';
import Root from './root/Root';
import { configureStore, history } from './root/store/configureStore';
import './ui.global.css';
import listener from './events';
// const initialState = fs.readJsonSync('/Users/alexmorris/Documents/FCA/eBundleAuthor/state.json')

const store = configureStore();

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./root/Root', () => {
    const NextRoot = require('./root/Root'); // eslint-disable-line global-require
    render(
      <AppContainer>
        <NextRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}

listener(ipcRenderer, store);
