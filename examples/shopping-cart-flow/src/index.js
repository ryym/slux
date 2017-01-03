// @flow

// import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'slux/react';
import App from './components/App';
import store from './stores/root';
import { dispatcher, commands } from './dispatcher';

store.onMutation(mutationData => {
  console.log('CHANGED', mutationData.type, store.takeSnapshot());
});

dispatcher.dispatch(commands.loadProducts);

ReactDOM.render(
  <Provider dispatcher={dispatcher}>
    <App />
  </Provider>,
    document.getElementById('root')
);
