// import 'babel-polyfill';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './components/App';
import facade from './stores/facade'

facade.onStateChange(mutationData => {
    console.log('CHANGED', mutationData.type, facade.takeSnapshot());
});

facade.methods.loadProducts()

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
