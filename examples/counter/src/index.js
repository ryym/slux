import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import Counter from './components/Counter';
import store from './store';

function render() {
  const { actions, mutations } = store;
  ReactDOM.render(
    <Counter
      value={store.getOwnState()}
      onIncrement={() => mutations.increment()}
      onDecrement={() => mutations.decrement()}
      onIncrementIfOdd={() => mutations.incrementIfOdd()}
      onIncrementAsync={() => actions.incrementAsync()}
    />,
    document.getElementById('root')
  );
}

render();
store.onMutation(render);
