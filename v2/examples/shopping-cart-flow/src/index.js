// @flow

// import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import facade from './stores/facade';

facade.onStateChange(mutationData => {
  console.log('CHANGED', mutationData.type, facade.takeSnapshot());
});

facade.methods.loadProducts();

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
