import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { dispatcher, commands } from './dispatcher';
import store from './store';

store.onStateChange(mutationData => {
  console.log('CHANGED', mutationData.type, store.takeSnapshot());
});

dispatcher.dispatch(commands.loadProducts);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
