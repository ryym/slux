import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'slux/react';
import { dispatcher, commands } from './dispatcher';
import App from './components/App';

dispatcher.dispatch(commands.loadProducts());

ReactDOM.render(
  <Provider dispatcher={dispatcher}>
    <App />
  </Provider>,
  document.getElementById('root')
);


