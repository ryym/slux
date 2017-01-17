import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import App from './components/App.connect';
import { dispatcher, commands } from './dispatcher';
import store from './store';

// Logging
if (process.env.NODE_ENV === 'development') {
  store.onEffect(effectData => {
    console.log('EFFECT', effectData.type);
  });
  store.onMutation((mutationData, store) => {
    console.log(mutationData.type, store.takeSnapshot());
  });
}

dispatcher.dispatch(commands.initializePosts);

render(
  <App />,
  document.getElementById('root')
);
