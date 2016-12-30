import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'slux/react';
import App from './components/App.connect';
import store from './store';
import { getSelectedReddit } from './store/reddit';
import { dispatcher, commands } from './dispatcher';

// Logging
if (process.env.NODE_ENV === 'development') {
  store.onAction(actionData => {
    console.log('ACTION', actionData.type);
  });
  store.onMutation((mutationData, store) => {
    console.log(mutationData.type, store.takeSnapshot());
  });
}

const reddit = store.query(getSelectedReddit);
dispatcher.dispatch(commands.fetchPosts, reddit);

render(
  <Provider dispatcher={dispatcher}>
    <App />
  </Provider>,
  document.getElementById('root')
);
