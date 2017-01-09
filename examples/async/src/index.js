import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import App from './components/App.connect';
import facade from './facade';
import store from './store';

// Logging
if (process.env.NODE_ENV === 'development') {
  store.onAction(actionData => {
    console.log('ACTION', actionData.type);
  });
  store.onMutation((mutationData, store) => {
    console.log(mutationData.type, store.takeSnapshot());
  });
}

facade.methods.initializePosts();

render(
  <App />,
  document.getElementById('root')
);
