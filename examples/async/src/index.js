import 'babel-polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'slux/react';
import App from './components/App.connect';
import store from './store';
import dispatcher, { commands } from './dispatcher';

if (process.env.NODE_ENV === 'development') {
  store.onAction(actionData => {
    console.log('ACTION', actionData.type);
  });
  store.onMutation((store, mutationData) => {
    console.log(mutationData.type, store.takeSnapshot());
  });
}

dispatcher.dispatch(
  commands.FETCH_POSTS,
  store.getters.getSelectedReddit()
);

render(
  <Provider dispatcher={dispatcher}>
    <App />
  </Provider>,
  document.getElementById('root')
);
